import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {
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
    { n: 1, icon: 'search', titleAr: 'ابحث عن دوائك', titleEn: 'Search Your Medicine', descAr: 'اكتب اسم الدواء أو المادة الفعالة', descEn: 'Type the medicine or active ingredient' },
    { n: 2, icon: 'local_pharmacy', titleAr: 'شاهد الصيدليات', titleEn: 'See Pharmacies', descAr: 'اعرف الصيدليات التي يتوفر بها الدواء', descEn: 'Find pharmacies where the medicine is available' },
    { n: 3, icon: 'directions_walk', titleAr: 'توجّه للصيدلية', titleEn: 'Go to Pharmacy', descAr: 'اذهب مباشرةً لأقرب صيدلية ووفّر وقتك', descEn: 'Head directly and save your time' },
  ];

  ngOnInit(): void {
    this.popularMedicines.set(this.data.getMedicines().slice(0, 6));
    this.categories.set(this.data.getCategories());
    this.activePharmacies.set(this.data.getActivePharmacies());

    this.startCarouselLoop();
  }

  ngOnDestroy(): void {
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
    }
  }

  startCarouselLoop(): void {
    this.carouselTimer = setInterval(() => {
      this.carouselIndex.update(idx => (idx + 1) % 3);
    }, 5500);
  }

  goToSlide(index: number): void {
    this.carouselIndex.set(index);
    if (this.carouselTimer) {
      clearInterval(this.carouselTimer);
      this.startCarouselLoop();
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
