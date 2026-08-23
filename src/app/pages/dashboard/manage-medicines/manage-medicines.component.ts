import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';
import { RouterModule } from '@angular/router';

import { DialogService } from '../../../core/services/dialog.service';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MedicineImageComponent } from '../../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-manage-medicines',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, MedicineImageComponent],
  templateUrl: './manage-medicines.component.html',
  styleUrls: ['./manage-medicines.component.scss']
})
export class ManageMedicinesComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);
  dialog = inject(DialogService);
  fb = inject(FormBuilder);

  medicinesData = signal<{ medicine: Medicine; price: number | null; inStock: boolean }[]>([]);
  editingEntry = signal<{ medicine: Medicine; price: number | null; inStock: boolean } | null>(null);

  editForm: FormGroup = this.fb.group({
    price: [0, [Validators.required, Validators.min(0)]],
    inStock: [true]
  });

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.editingEntry()) {
      this.closeEditModal();
    }
  }

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

  loadMedicines(): void {
    this.ngOnInit();
  }

  openEditModal(item: { medicine: Medicine; price: number | null; inStock: boolean }) {
    this.editingEntry.set(item);
    this.editForm.reset({
      price: item.price || 0,
      inStock: item.inStock
    });
  }

  closeEditModal() {
    this.editingEntry.set(null);
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    
    const item = this.editingEntry();
    const pharmacyId = this.auth.currentUser()?.pharmacyId;
    if (item && pharmacyId) {
      const vals = this.editForm.value;
      this.data.updatePharmacyMedicine(pharmacyId, item.medicine.id, vals.price, vals.inStock);
      
      this.loadMedicines();
      this.closeEditModal();
      this.dialog.toast(this.t('تم حفظ التعديلات بنجاح!', 'Changes saved successfully!'), 'success');
    }
  }

  async deleteMedicine(id: string) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تأكيد الحذف', 'Confirm Deletion'),
      message: this.t('هل أنت متأكد من حذف هذا الدواء من مخزونك؟', 'Are you sure you want to delete this medicine from your stock?'),
      isDanger: true,
      confirmText: this.t('حذف', 'Delete'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.medicinesData.update(meds => meds.filter(m => m.medicine.id !== id));
      this.dialog.toast(this.t('تم حذف الدواء بنجاح', 'Medicine deleted successfully'), 'success');
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
