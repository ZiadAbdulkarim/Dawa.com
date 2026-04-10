import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';
import { Category } from '../../core/models/category.model';
import { Pharmacy } from '../../core/models/pharmacy.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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

  quickHints = [
    { q: 'باراسيتامول', label: 'باراسيتامول' },
    { q: 'Paracetamol', label: 'Paracetamol' },
    { q: 'أوميبرازول', label: 'أوميبرازول' },
    { q: 'Vitamin D', label: 'Vitamin D' },
  ];

  howSteps = [
    { n: 1, icon: 'search', titleAr: 'ابحث عن دوائك', titleEn: 'Search Your Medicine', descAr: 'اكتب اسم الدواء أو المادة الفعالة', descEn: 'Type the medicine or active ingredient' },
    { n: 2, icon: 'local_pharmacy', titleAr: 'شاهد الصيدليات', titleEn: 'See Pharmacies', descAr: 'اعرف الصيدليات التي تمتلكه والسعر', descEn: 'Find which pharmacies have it and the price' },
    { n: 3, icon: 'directions_walk', titleAr: 'توجّه للصيدلية', titleEn: 'Go to Pharmacy', descAr: 'اذهب مباشرةً لأقرب صيدلية ووفّر وقتك', descEn: 'Head directly and save your time' },
  ];


  ngOnInit(): void {
    this.popularMedicines.set(this.data.getMedicines().slice(0, 6));
    this.categories.set(this.data.getCategories());
    this.activePharmacies.set(this.data.getActivePharmacies());
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

  getPriceRange(med: Medicine): string {
    const pharmacies = this.data.getPharmaciesForMedicine(med.id);
    if (!pharmacies.length) return '';
    const prices = pharmacies
      .map(p => this.data.getMedicinePrice(p.id, med.id))
      .filter((p): p is number => p !== null);
    if (!prices.length) return '';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min} ${this.t('ج.م', 'EGP')}` : `${min}–${max} ${this.t('ج.م', 'EGP')}`;
  }

  getCategoryPharmacyIds(pharmacies: Pharmacy[]): string {
    return pharmacies.slice(0, 3).map(p => this.lang.isArabic ? p.nameAr : p.nameEn).join('، ');
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
