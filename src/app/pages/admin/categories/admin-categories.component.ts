import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';

import { DialogService } from '../../../core/services/dialog.service';

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
  styleUrls: ['./admin-categories.component.scss']
})
export class AdminCategoriesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  dialog = inject(DialogService);
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
      this.dialog.toast(this.t('تم التعديل بنجاح!', 'Edited successfully!'), 'success');
    } else {
      const newCat: Category = {
        id: 'c' + (this.categories().length + 1),
        nameAr: vals.nameAr,
        nameEn: vals.nameEn
      };
      this.categories.update(cats => [...cats, newCat]);
      this.dialog.toast(this.t('تمت الإضافة بنجاح!', 'Added successfully!'), 'success');
    }
    this.closeModal();
  }

  async deleteCategory(id: string) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تأكيد الحذف', 'Confirm Deletion'),
      message: this.t('هل أنت متأكد من حذف هذا التصنيف؟', 'Are you sure you want to delete this category?'),
      isDanger: true,
      confirmText: this.t('حذف', 'Delete'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.categories.update(cats => cats.filter(c => c.id !== id));
      this.dialog.toast(this.t('تم الحذف بنجاح', 'Deleted successfully'), 'success');
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
