import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Pharmacy } from '../../core/models/pharmacy.model';

@Component({
  selector: 'app-pharmacies-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './pharmacies-list.component.html',
  styleUrls: ['./pharmacies-list.component.scss'],
})
export class PharmaciesListComponent implements OnInit {
  lang = inject(LanguageService);
  data = inject(DataService);

  searchQuery = signal('');
  selectedCity = signal('');
  selectedStatus = signal<'all' | 'open' | 'closed'>('all');

  pharmacies = signal<Pharmacy[]>([]);
  filteredPharmacies = signal<Pharmacy[]>([]);
  cities = signal<{ value: string; labelAr: string; labelEn: string }[]>([]);

  ngOnInit(): void {
    const activePhs = this.data.getActivePharmacies();
    this.pharmacies.set(activePhs);
    this.filteredPharmacies.set(activePhs);

    // Extract unique cities
    const cityMap = new Map<string, { labelAr: string; labelEn: string }>();
    activePhs.forEach(ph => {
      if (!cityMap.has(ph.city)) {
        cityMap.set(ph.city, { labelAr: ph.cityAr, labelEn: ph.city });
      }
    });

    const cityList = Array.from(cityMap.entries()).map(([value, obj]) => ({
      value,
      labelAr: obj.labelAr,
      labelEn: obj.labelEn
    }));

    this.cities.set(cityList);
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCityChange(city: string): void {
    this.selectedCity.set(city);
    this.applyFilters();
  }

  onStatusChange(status: 'all' | 'open' | 'closed'): void {
    this.selectedStatus.set(status);
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCity.set('');
    this.selectedStatus.set('all');
    this.applyFilters();
  }

  private applyFilters(): void {
    let list = this.pharmacies();
    const q = this.searchQuery().toLowerCase().trim();

    if (q) {
      list = list.filter(p =>
        p.nameAr.includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.areaAr.includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.addressAr.includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    }

    if (this.selectedCity()) {
      list = list.filter(p => p.city === this.selectedCity());
    }

    if (this.selectedStatus() === 'open') {
      list = list.filter(p => p.isOpen);
    } else if (this.selectedStatus() === 'closed') {
      list = list.filter(p => !p.isOpen);
    }

    this.filteredPharmacies.set(list);
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
