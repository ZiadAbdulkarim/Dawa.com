import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';

interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
}

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categories.component.html',
  styleUrls: ['./admin-categories.component.scss'] /* we can reuse some global modal styles but will define specific here */
})
export class AdminCategoriesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  fb = inject(FormBuilder);

  categories = signal<Category[]>(this.data.getCategories());
  showModal = signal(false);
  editingId = signal<string | null>(null);

  categoryForm: FormGroup = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required]
  });

  openModal(cat?: Category) {
    if (cat) {
      this.editingId.set(cat.id);
      this.categoryForm.patchValue({
        nameAr: cat.nameAr,
        nameEn: cat.nameEn
      });
    } else {
      this.editingId.set(null);
      this.categoryForm.reset();
    }
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveCategory() {
    if (this.categoryForm.invalid) return;

    const vals = this.categoryForm.value;
    const editing = this.editingId();

    if (editing) {
      this.categories.update(cats => cats.map(c => 
        c.id === editing ? { ...c, nameAr: vals.nameAr, nameEn: vals.nameEn } : c
      ));
      alert(this.t('تم التعديل بنجاح!', 'Edited successfully!'));
    } else {
      const newCat: Category = {
        id: 'c' + (this.categories().length + 1),
        nameAr: vals.nameAr,
        nameEn: vals.nameEn
      };
      this.categories.update(cats => [...cats, newCat]);
      alert(this.t('تمت الإضافة بنجاح!', 'Added successfully!'));
    }
    this.closeModal();
  }

  deleteCategory(id: string) {
    if (confirm(this.t('هل أنت متأكد من حذف هذا التصنيف؟', 'Are you sure you want to delete this category?'))) {
      this.categories.update(cats => cats.filter(c => c.id !== id));
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
