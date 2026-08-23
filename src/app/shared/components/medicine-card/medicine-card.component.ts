import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Medicine } from '../../../core/models/medicine.model';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';

import { MedicineImageComponent } from '../medicine-image/medicine-image.component';

@Component({
  selector: 'app-medicine-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MedicineImageComponent],
  templateUrl: './medicine-card.component.html',
  styleUrls: ['./medicine-card.component.scss'],
})
export class MedicineCardComponent {
  lang = inject(LanguageService);
  data = inject(DataService);

  @Input({ required: true }) medicine!: Medicine;

  get name(): string { return this.lang.isArabic ? this.medicine.nameAr : this.medicine.nameEn; }
  get genericName(): string { return this.lang.isArabic ? this.medicine.genericNameAr : this.medicine.genericNameEn; }
  get category(): string { return this.medicine.categoryId; }
  get pharmacyCount(): number { return this.data.getPharmaciesForMedicine(this.medicine.id).length; }

  get formIcon(): string {
    const icons: Record<string, string> = {
      tablet: 'medication', capsule: 'medication', syrup: 'water_drop',
      injection: 'vaccines', cream: 'spa', drops: 'opacity', inhaler: 'air',
    };
    return icons[this.medicine.form] ?? 'medication';
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
