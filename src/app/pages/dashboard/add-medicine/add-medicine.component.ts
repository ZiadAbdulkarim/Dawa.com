import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { DialogService } from '../../../core/services/dialog.service';
import { Medicine } from '../../../core/models/medicine.model';

type Step = 1 | 2;
type AddMode = 'existing' | 'new' | null;

import { MedicineImageComponent } from '../../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MedicineImageComponent],
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss']
})
export class AddMedicineComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  fb = inject(FormBuilder);

  dialog = inject(DialogService);

  currentStep = signal<Step>(1);
  addMode = signal<AddMode>(null);
  selectedMedicine = signal<Medicine | null>(null);
  
  searchQuery = signal('');
  suggestions = signal<Medicine[]>([]);

  // Forms
  stockForm: FormGroup = this.fb.group({
    price: [null, [Validators.required, Validators.min(1)]],
    quantity: [null, [Validators.required, Validators.min(1)]]
  });

  newMedicineForm: FormGroup = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    category: ['', Validators.required],
    description: [''],
    uses: [''],
    sideEffects: [''],
    image: [null]
  });

  get categories() {
    return this.data.getCategories();
  }

  onSearchChange(event: Event) {
    const query = (event.target as HTMLInputElement).value;
    this.searchQuery.set(query);
    if (query.trim().length > 1) {
      this.suggestions.set(this.data.searchMedicines(query));
    } else {
      this.suggestions.set([]);
    }
  }

  selectExisting(med: Medicine) {
    this.selectedMedicine.set(med);
    this.addMode.set('existing');
    this.currentStep.set(2);
  }

  startNewMedicine() {
    this.selectedMedicine.set(null);
    this.addMode.set('new');
    this.currentStep.set(2);
  }

  goBack() {
    this.currentStep.set(1);
    this.addMode.set(null);
    this.selectedMedicine.set(null);
    this.stockForm.reset();
    this.newMedicineForm.reset();
  }

  onImageUpload(event: Event) {
    // Just a mock handler for the file input
  }

  async submitExisting() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    await this.dialog.alert({
      title: this.t('تمت الإضافة بنجاح', 'Added Successfully'),
      message: this.t('تم إضافة الدواء للمخزون بنجاح!', 'Medicine added to stock successfully!'),
      type: 'success'
    });
    this.goBack();
  }

  async submitNew() {
    if (this.newMedicineForm.invalid) {
      this.newMedicineForm.markAllAsTouched();
      return;
    }
    await this.dialog.alert({
      title: this.t('تم التسجيل بنجاح', 'Registered Successfully'),
      message: this.t('تم تسجيل الدواء الجديد وإضافته بنجاح!', 'New medicine registered and added successfully!'),
      type: 'success'
    });
    this.goBack();
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
