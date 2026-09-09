import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';
import { Pharmacy } from '../../core/models/pharmacy.model';

import { MedicineImageComponent } from '../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-medicine-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MedicineImageComponent],
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.scss'],
})
export class MedicineDetailComponent implements OnInit {
  lang = inject(LanguageService);
  data = inject(DataService);
  route = inject(ActivatedRoute);

  medicine = signal<Medicine | null>(null);
  pharmacies = signal<Pharmacy[]>([]);


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const med = this.data.getMedicineById(params['id']);

      if (med) {
        this.medicine.set(med);

        const pharmacies = this.data.getPharmaciesForMedicine(med.id);
        this.pharmacies.set(pharmacies);
      }
    });
  }

  /** Returns the standardized medicine price formatted for display. */
  formatPrice(med: Medicine): string {
    if (!med.basePrice) return '';
    return `${med.basePrice} ${this.t('ج.م', 'EGP')}`;
  }

  isInStock(pharmacyId: string, medicineId: string): boolean {
    return this.data.isMedicineInStock(pharmacyId, medicineId);
  }

  get formIcon(): string {
    const med = this.medicine();
    if (!med) return 'medication';

    const icons: Record<string, string> = {
      tablet: 'medication',
      capsule: 'medication',
      syrup: 'water_drop',
      injection: 'vaccines',
      cream: 'spa',
      drops: 'opacity',
      inhaler: 'air',
    };

    return icons[med.form] ?? 'medication';
  }

  get stars(): number[] {
    return [0, 1, 2, 3, 4];
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}