import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';

@Component({
  selector: 'app-admin-medicines',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-medicines.component.html',
  styleUrls: ['./admin-medicines.component.scss']
})
export class AdminMedicinesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  fb = inject(FormBuilder);

  medicines = signal<Medicine[]>(this.data.getMedicines());
  editingMedicine = signal<Medicine | null>(null);

  editForm: FormGroup = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    descriptionAr: ['', Validators.required],
    descriptionEn: ['', Validators.required],
    image: [null]
  });

  openEditModal(med: Medicine) {
    this.editingMedicine.set(med);
    this.editForm.patchValue({
      nameAr: med.nameAr,
      nameEn: med.nameEn,
      descriptionAr: med.descriptionAr || '',
      descriptionEn: med.descriptionEn || ''
    });
  }

  closeModal() {
    this.editingMedicine.set(null);
    this.editForm.reset();
  }

  onImageUpload(event: Event) {
    // Mock image upload
  }

  saveEdit() {
    if (this.editForm.invalid) return;

    const med = this.editingMedicine();
    if (med) {
      const vals = this.editForm.value;
      // In a real app, update via API. Here we just update local signal state.
      this.medicines.update(meds => meds.map(m => {
        if (m.id === med.id) {
          return { ...m, nameAr: vals.nameAr, nameEn: vals.nameEn, descriptionAr: vals.descriptionAr, descriptionEn: vals.descriptionEn };
        }
        return m;
      }));
      alert(this.t('تم التعديل بنجاح!', 'Edited successfully!'));
      this.closeModal();
    }
  }

  deleteMedicine(id: string) {
    if (confirm(this.t('هل أنت متأكد من الحذف؟', 'Are you sure you want to delete this?'))) {
      this.medicines.update(meds => meds.filter(m => m.id !== id));
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
