import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Medicine } from '../../../core/models/medicine.model';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-medicine-image',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (medicine.imageUrl) {
      <img
        [src]="medicine.imageUrl"
        [alt]="altText"
        class="medicine-image"
        loading="lazy"
      />
    } @else {
      <span class="material-icons-round medicine-image-fallback">{{ medicine.imageIcon }}</span>
    }
  `,
  styles: [`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }

    .medicine-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .medicine-image-fallback {
      line-height: 1;
    }
  `],
})
export class MedicineImageComponent {
  private lang = inject(LanguageService);

  @Input({ required: true }) medicine!: Medicine;

  get altText(): string {
    return this.lang.isArabic ? this.medicine.nameAr : this.medicine.nameEn;
  }
}
