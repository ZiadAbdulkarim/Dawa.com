import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { MedicineCardComponent } from '../../shared/components/medicine-card/medicine-card.component';
import { Pharmacy } from '../../core/models/pharmacy.model';
import { Medicine } from '../../core/models/medicine.model';

@Component({
  selector: 'app-pharmacy-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MedicineCardComponent],
  templateUrl: './pharmacy-detail.component.html',
  styleUrls: ['./pharmacy-detail.component.scss'],
})
export class PharmacyDetailComponent implements OnInit {
  lang = inject(LanguageService);
  data = inject(DataService);
  route = inject(ActivatedRoute);

  pharmacy = signal<Pharmacy | null>(null);
  medicines = signal<Medicine[]>([]);
  searchQuery = '';
  filteredMedicines = signal<Medicine[]>([]);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const ph = this.data.getPharmacyById(params['id']);
      if (ph) {
        this.pharmacy.set(ph);
        const meds = this.data.getMedicinesForPharmacy(ph.id);
        this.medicines.set(meds);
        this.filteredMedicines.set(meds);
      }
    });
  }

  get name(): string {
    const ph = this.pharmacy();
    if (!ph) return '';
    return this.lang.isArabic ? ph.nameAr : ph.nameEn;
  }

  get address(): string {
    const ph = this.pharmacy();
    if (!ph) return '';
    return this.lang.isArabic ? ph.addressAr : ph.address;
  }

  get city(): string {
    const ph = this.pharmacy();
    if (!ph) return '';
    return this.lang.isArabic ? ph.cityAr : ph.city;
  }

  get area(): string {
    const ph = this.pharmacy();
    if (!ph) return '';
    return this.lang.isArabic ? ph.areaAr : ph.area;
  }

  get hours(): string {
    const ph = this.pharmacy();
    if (!ph) return '';
    return this.lang.isArabic ? ph.workingHoursAr : ph.workingHours;
  }

  get stars(): number[] { return Array(5).fill(0).map((_, i) => i); }
  get fullStars(): number { return Math.floor(this.pharmacy()?.rating ?? 0); }

  filterMedicines(): void {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) { this.filteredMedicines.set(this.medicines()); return; }
    this.filteredMedicines.set(
      this.medicines().filter(m =>
        m.nameAr.includes(this.searchQuery) ||
        m.nameEn.toLowerCase().includes(q)
      )
    );
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
