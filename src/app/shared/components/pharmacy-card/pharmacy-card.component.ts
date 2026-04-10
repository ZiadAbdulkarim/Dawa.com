import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pharmacy } from '../../../core/models/pharmacy.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-pharmacy-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pharmacy-card.component.html',
  styleUrls: ['./pharmacy-card.component.scss'],
})
export class PharmacyCardComponent {
  lang = inject(LanguageService);

  @Input({ required: true }) pharmacy!: Pharmacy;

  get name(): string { return this.lang.isArabic ? this.pharmacy.nameAr : this.pharmacy.nameEn; }
  get address(): string { return this.lang.isArabic ? this.pharmacy.addressAr : this.pharmacy.address; }
  get city(): string { return this.lang.isArabic ? this.pharmacy.cityAr : this.pharmacy.city; }
  get area(): string { return this.lang.isArabic ? this.pharmacy.areaAr : this.pharmacy.area; }
  get hours(): string { return this.lang.isArabic ? this.pharmacy.workingHoursAr : this.pharmacy.workingHours; }

  get stars(): number[] { return Array(5).fill(0).map((_, i) => i); }
  get fullStars(): number { return Math.floor(this.pharmacy.rating); }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
