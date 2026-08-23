import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';
import { DialogService } from '../../../core/services/dialog.service';

import { MedicineImageComponent } from '../../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-admin-medicines',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MedicineImageComponent],
  templateUrl: './admin-medicines.component.html',
  styleUrls: ['./admin-medicines.component.scss']
})
export class AdminMedicinesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  dialog = inject(DialogService);
  fb = inject(FormBuilder);

  medicines = signal<Medicine[]>(this.data.getMedicines());
  editingMedicine = signal<Medicine | null>(null);

  editForm: FormGroup = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    descriptionAr: [''],
    descriptionEn: [''],
    image: [null]
  });

  @HostListener('window:keydown.escape')
  onEscape() {
    if (this.editingMedicine()) {
      this.closeModal();
    }
  }

  openEditModal(med: Medicine) {
    this.editingMedicine.set(med);
    this.editForm.reset({
      nameAr: med.nameAr,
      nameEn: med.nameEn,
      descriptionAr: med.descriptionAr || '',
      descriptionEn: med.descriptionEn || '',
      image: null
    });
  }

  closeModal() {
    this.editingMedicine.set(null);
    this.editForm.reset();
  }

  onImageUpload(event: Event) {
    // Mock image upload handler
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    const med = this.editingMedicine();
    if (med) {
      const vals = this.editForm.value;
      const updatedMed: Medicine = {
        ...med,
        nameAr: vals.nameAr,
        nameEn: vals.nameEn,
        descriptionAr: vals.descriptionAr || '',
        descriptionEn: vals.descriptionEn || ''
      };
      this.data.updateMedicine(updatedMed);
      this.medicines.set(this.data.getMedicines());
      this.closeModal();
      this.dialog.toast(this.t('تم حفظ التعديلات بنجاح!', 'Changes saved successfully!'), 'success');
    }
  }

  async deleteMedicine(id: string) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تأكيد الحذف', 'Confirm Deletion'),
      message: this.t('هل أنت متأكد من حذف هذا الدواء نهائياً؟', 'Are you sure you want to delete this medicine permanently?'),
      isDanger: true,
      confirmText: this.t('حذف', 'Delete'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.data.deleteMedicine(id);
      this.medicines.set(this.data.getMedicines());
      this.dialog.toast(this.t('تم الحذف بنجاح', 'Deleted successfully'), 'success');
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
