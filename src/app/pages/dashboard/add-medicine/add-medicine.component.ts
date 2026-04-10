import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';

type Step = 1 | 2;
type AddMode = 'existing' | 'new' | null;

@Component({
  selector: 'app-add-medicine',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-medicine.component.html',
  styleUrls: ['./add-medicine.component.scss']
})
export class AddMedicineComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  fb = inject(FormBuilder);

  currentStep = signal<Step>(1);
  addMode = signal<AddMode>(null);
  selectedMedicine = signal<Medicine | null>(null);
  
  searchQuery = signal('');
  suggestions = signal<Medicine[]>([]);

  // Forms
  stockForm: FormGroup = this.fb.group({
    price: ['', [Validators.required, Validators.min(0)]],
    quantity: ['', [Validators.required, Validators.min(1)]] // quantity will act as dummy for inStock
  });

  newMedicineForm: FormGroup = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    uses: ['', Validators.required],
    sideEffects: ['', Validators.required],
    image: [null]
  });

  get categories() {
    return this.data.getCategories();
  }

  onSearchChange(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchQuery.set(q);
    if (q.trim().length > 1) {
      this.suggestions.set(this.data.searchMedicines(q).slice(0, 5));
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

  submitExisting() {
    if (this.stockForm.invalid) {
      this.stockForm.markAllAsTouched();
      return;
    }
    alert(this.t('تم إضافة الدواء للمخزون بنجاح!', 'Medicine added to stock successfully!'));
    this.goBack();
  }

  submitNew() {
    if (this.newMedicineForm.invalid) {
      this.newMedicineForm.markAllAsTouched();
      return;
    }
    alert(this.t('تم تسجيل الدواء الجديد وإضافته بنجاح!', 'New medicine registered and added successfully!'));
    this.goBack();
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
