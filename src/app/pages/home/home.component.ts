import { Component, inject, signal, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';
import { Category } from '../../core/models/category.model';
import { Pharmacy } from '../../core/models/pharmacy.model';

import { MedicineImageComponent } from '../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MedicineImageComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  lang = inject(LanguageService);
  data = inject(DataService);
  router = inject(Router);

  searchQuery = '';
  suggestions = signal<Medicine[]>([]);
  showSuggestions = signal(false);

  popularMedicines = signal<Medicine[]>([]);
  categories = signal<Category[]>([]);
  activePharmacies = signal<Pharmacy[]>([]);
  stats = this.data.getStats();

  // Carousel state: active index (0 = How it Works, 1 = Platform Statistics)
  carouselIndex = signal<number>(0);
  private carouselTimer?: any;

  // Mobile categories expanded state
  categoriesExpanded = signal<boolean>(false);
  visibleCategoryCount = signal<number>(4);
  private resizeObserver?: ResizeObserver;

  toggleCategories(): void {
    this.categoriesExpanded.update(v => !v);
  }

  quickHints = [
    { q: 'باراسيتامول', label: 'باراسيتامول' },
    { q: 'Paracetamol', label: 'Paracetamol' },
    { q: 'أوميبرازول', label: 'أوميبرازول' },
    { q: 'Vitamin D', label: 'Vitamin D' },
  ];

  howSteps = [
    { n: 1, img: '/assets/images/how-dawa.com-works/Search-Your-Medicine.png', titleAr: 'ابحث عن دوائك', titleEn: 'Search Your Medicine', descAr: 'اكتب اسم الدواء أو المادة الفعالة', descEn: 'Type the medicine or active ingredient' },
    { n: 2, img: '/assets/images/how-dawa.com-works/See-Pharmacies.png', titleAr: 'شاهد الصيدليات', titleEn: 'See Pharmacies', descAr: 'اعرف الصيدليات التي يتوفر بها الدواء', descEn: 'Find pharmacies where the medicine is available' },
    { n: 3, img: '/assets/images/how-dawa.com-works/Go-to-Pharmacy.png', titleAr: 'توجّه للصيدلية', titleEn: 'Go to Pharmacy', descAr: 'اذهب مباشرةً لأقرب صيدلية ووفّر وقتك', descEn: 'Head directly and save your time' },
  ];

  ngOnInit(): void {
    this.popularMedicines.set(this.data.getMedicines().slice(0, 6));
    this.categories.set(this.data.getCategories());
    this.activePharmacies.set(this.data.getActivePharmacies());

    this.startCarouselLoop();
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      const container = document.querySelector('.categories-horizontal-list');
      if (container) {
        this.resizeObserver = new ResizeObserver(entries => {
          for (const entry of entries) {
            const width = entry.contentRect.width;
            if (width > 0) {
              const targetWidth = width <= 480 ? 68 : width <= 768 ? 85 : 105;
              const maxItems = Math.max(3, Math.floor(width / targetWidth));
              const count = Math.min(this.categories().length, maxItems - 1);
              this.visibleCategoryCount.set(count);
            }
          }
        });
        this.resizeObserver.observe(container);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  startCarouselLoop(): void {
    this.carouselTimer = setInterval(() => {
      this.carouselIndex.update(idx => (idx + 1) % 2);
    }, 5500);
  }

  goToSlide(index: number): void {
    this.carouselIndex.set(index);
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.startCarouselLoop();
    }
  }

  // Touch swipe handling
  private touchStartX = 0;
  private touchStartY = 0;
  private touchEndX = 0;
  private touchEndY = 0;

  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
      this.touchEndX = this.touchStartX;
      this.touchEndY = this.touchStartY;
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (event.touches.length === 1) {
      this.touchEndX = event.touches[0].clientX;
      this.touchEndY = event.touches[0].clientY;
      const deltaX = Math.abs(this.touchEndX - this.touchStartX);
      const deltaY = Math.abs(this.touchEndY - this.touchStartY);
      if (deltaX > deltaY && deltaX > 10) {
        if (event.cancelable) {
          event.preventDefault();
        }
      }
    }
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const threshold = 40; // minimum drag distance in px

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) >= threshold) {
      const isArabic = this.lang.isArabic;
      const totalSlides = 2;
      const current = this.carouselIndex();

      if (deltaX < 0) {
        // Dragged left: physically moving finger left.
        // In LTR, left drag moves to NEXT slide.
        // In RTL (Arabic), left drag moves to PREVIOUS slide.
        const next = isArabic
          ? (current - 1 + totalSlides) % totalSlides
          : (current + 1) % totalSlides;
        this.goToSlide(next);
      } else {
        // Dragged right: physically moving finger right.
        // In LTR, right drag moves to PREVIOUS slide.
        // In RTL (Arabic), right drag moves to NEXT slide.
        const prev = isArabic
          ? (current + 1) % totalSlides
          : (current - 1 + totalSlides) % totalSlides;
        this.goToSlide(prev);
      }
    }
  }

  onSearchInput(): void {
    if (this.searchQuery.length >= 2) {
      this.suggestions.set(this.data.searchMedicines(this.searchQuery).slice(0, 7));
      this.showSuggestions.set(true);
    } else {
      this.showSuggestions.set(false);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.showSuggestions.set(false);
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  selectSuggestion(med: Medicine): void {
    this.showSuggestions.set(false);
    this.router.navigate(['/medicine', med.id]);
  }

  closeSuggestions(): void {
    setTimeout(() => this.showSuggestions.set(false), 200);
  }

  /** Returns the standardized medicine price formatted for display. */
  formatPrice(med: Medicine): string {
    if (!med.basePrice) return '';
    return `${med.basePrice} ${this.t('ج.م', 'EGP')}`;
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
