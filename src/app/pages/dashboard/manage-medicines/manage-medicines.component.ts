import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manage-medicines',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './manage-medicines.component.html',
  styleUrls: ['./manage-medicines.component.scss']
})
export class ManageMedicinesComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);

  medicinesData = signal<{ medicine: Medicine; price: number | null; inStock: boolean }[]>([]);

  ngOnInit(): void {
    const pharmacyId = this.auth.currentUser()?.pharmacyId;
    if (pharmacyId) {
      const ph = this.data.getPharmacyById(pharmacyId);
      if (ph) {
        const meds = ph.medicineEntries.map(e => {
          const m = this.data.getMedicineById(e.medicineId);
          return {
            medicine: m!,
            price: e.price,
            inStock: e.inStock
          };
        }).filter(m => m.medicine != null);
        this.medicinesData.set(meds);
      }
    }
  }

  deleteMedicine(id: string) {
    const confirm = window.confirm(this.t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete this medicine?'));
    if (confirm) {
        this.medicinesData.update(meds => meds.filter(m => m.medicine.id !== id));
        // Note: Mock data service not permanently updated, just local component state
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
