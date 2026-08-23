import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';
import { Category } from '../../core/models/category.model';

import { MedicineImageComponent } from '../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MedicineImageComponent],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  lang = inject(LanguageService);
  data = inject(DataService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  searchQuery = signal('');
  results = signal<Medicine[]>([]);
  allResults = signal<Medicine[]>([]);
  categories = signal<Category[]>([]);
  isLoading = signal(true);
  skeletons = Array(9).fill(0);

  // Mobile filter collapse toggle
  filtersExpanded = signal(false);

  // Filters
  selectedCategory = signal<string>('');
  selectedAvailability = signal<'all' | 'prescription' | 'otc'>('all');
  priceMin = signal<number | null>(null);
  priceMax = signal<number | null>(null);
  sortBy = signal<'relevance' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'availability'>('relevance');

  sortOptions = [
    { value: 'relevance'   as const, labelAr: 'الأكثر صلة', labelEn: 'Relevance' },
    { value: 'name-asc'    as const, labelAr: 'أ–ي', labelEn: 'A–Z' },
    { value: 'name-desc'   as const, labelAr: 'ي–أ', labelEn: 'Z–A' },
    { value: 'price-asc'   as const, labelAr: 'السعر: الأقل', labelEn: 'Price: Low' },
    { value: 'price-desc'  as const, labelAr: 'السعر: الأعلى', labelEn: 'Price: High' },
    { value: 'availability' as const, labelAr: 'الأكثر توفراً', labelEn: 'Most Available' },
  ];
  availOpts = [
    { v: 'all' as const, labelAr: 'الكل', labelEn: 'All' },
    { v: 'otc' as const, labelAr: 'بدون وصفة', labelEn: 'OTC' },
    { v: 'prescription' as const, labelAr: 'يستلزم وصفة', labelEn: 'Prescription' },
  ];

  ngOnInit(): void {
    this.categories.set(this.data.getCategories());
    this.route.queryParams.subscribe(params => {
      this.searchQuery.set(params['q'] ?? '');
      if (params['category']) this.selectedCategory.set(params['category']);
      this.loadResults();
    });
  }

  loadResults(): void {
    this.isLoading.set(true);
    setTimeout(() => {
      let res = this.searchQuery()
        ? this.data.searchMedicines(this.searchQuery())
        : this.selectedCategory()
          ? this.data.getMedicinesByCategory(this.selectedCategory())
          : this.data.getMedicines();
      this.allResults.set(res);
      this.applyFiltersAndSort();
      this.isLoading.set(false);
    }, 350);
  }

  applyFiltersAndSort(): void {
    let res = [...this.allResults()];

    // Category filter
    if (this.selectedCategory()) {
      res = res.filter(m => m.categoryId === this.selectedCategory());
    }

    // Availability filter
    if (this.selectedAvailability() === 'prescription') res = res.filter(m => m.requiresPrescription);
    if (this.selectedAvailability() === 'otc') res = res.filter(m => !m.requiresPrescription);

    // Price filter (handle null, empty string, or NaN cleanly)
    const minP = this.priceMin();
    const maxP = this.priceMax();
    if (minP !== null && minP !== undefined && !isNaN(Number(minP)) && String(minP) !== '') {
      res = res.filter(m => m.basePrice >= Number(minP));
    }
    if (maxP !== null && maxP !== undefined && !isNaN(Number(maxP)) && String(maxP) !== '') {
      res = res.filter(m => m.basePrice <= Number(maxP));
    }

    // Sort
    switch (this.sortBy()) {
      case 'relevance':
        if (this.searchQuery().trim()) {
          const q = this.searchQuery().toLowerCase().trim();
          res.sort((a, b) => {
            const aName = (this.lang.isArabic ? a.nameAr : a.nameEn).toLowerCase();
            const bName = (this.lang.isArabic ? b.nameAr : b.nameEn).toLowerCase();
            const aExact = aName === q ? 2 : aName.startsWith(q) ? 1 : 0;
            const bExact = bName === q ? 2 : bName.startsWith(q) ? 1 : 0;
            return bExact - aExact;
          });
        }
        break;
      case 'name-asc':
        res.sort((a, b) => (this.lang.isArabic ? a.nameAr : a.nameEn).localeCompare(this.lang.isArabic ? b.nameAr : b.nameEn));
        break;
      case 'name-desc':
        res.sort((a, b) => (this.lang.isArabic ? b.nameAr : b.nameEn).localeCompare(this.lang.isArabic ? a.nameAr : a.nameEn));
        break;
      case 'price-asc':
        res.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-desc':
        res.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'availability':
        res.sort((a, b) => b.availableCount - a.availableCount);
        break;
    }

    this.results.set(res);
  }

  onCategoryChange(catId: string): void {
    this.selectedCategory.set(catId);
    this.applyFiltersAndSort();
  }

  onSortChange(sort: 'relevance' | 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'availability'): void {
    this.sortBy.set(sort);
    this.applyFiltersAndSort();
  }

  onAvailabilityChange(v: 'all' | 'prescription' | 'otc'): void {
    this.selectedAvailability.set(v);
    this.applyFiltersAndSort();
  }

  toggleMobileFilters(): void {
    this.filtersExpanded.update(v => !v);
  }

  resetFilters(): void {
    this.selectedCategory.set('');
    this.selectedAvailability.set('all');
    this.priceMin.set(null);
    this.priceMax.set(null);
    this.sortBy.set('relevance');
    this.applyFiltersAndSort();
  }

  getPriceRange(med: Medicine): string {
    const pharmacies = this.data.getPharmaciesForMedicine(med.id);
    if (!pharmacies.length) return '';
    const prices = pharmacies.map(p => this.data.getMedicinePrice(p.id, med.id)).filter((p): p is number => p !== null);
    if (!prices.length) return '';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? `${min}` : `${min}–${max}`;
  }

  getPharmacyCount(med: Medicine): number {
    return this.data.getPharmaciesForMedicine(med.id).length;
  }

  getCategoryName(catId: string): string {
    const cat = this.categories().find(c => c.id === catId);
    if (!cat) return catId;
    return this.lang.isArabic ? cat.nameAr : cat.nameEn;
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
