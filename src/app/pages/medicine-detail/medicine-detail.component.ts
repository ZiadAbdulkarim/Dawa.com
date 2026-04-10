import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';
import { Pharmacy } from '../../core/models/pharmacy.model';

@Component({
  selector: 'app-medicine-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './medicine-detail.component.html',
  styleUrls: ['./medicine-detail.component.scss'],
})
export class MedicineDetailComponent implements OnInit {
  lang = inject(LanguageService);
  data = inject(DataService);
  route = inject(ActivatedRoute);

  medicine = signal<Medicine | null>(null);
  pharmacies = signal<Pharmacy[]>([]);

  // 🔥 تحسين: نخزن أقل سعر بدل ما نحسبه كل مرة
  minPrice = signal<string>('–');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const med = this.data.getMedicineById(params['id']);

      if (med) {
        this.medicine.set(med);

        const pharmacies = this.data.getPharmaciesForMedicine(med.id);
        this.pharmacies.set(pharmacies);

        // ✅ حساب أقل سعر مرة واحدة
        this.calculateMinPrice(med.id, pharmacies);
      }
    });
  }

  // 🔥 دالة داخلية للحساب مرة واحدة
  private calculateMinPrice(medicineId: string, pharmacies: Pharmacy[]): void {
    const prices = pharmacies
      .map(p => this.data.getMedicinePrice(p.id, medicineId))
      .filter((p): p is number => p !== null);

    if (!prices.length) {
      this.minPrice.set('–');
      return;
    }

    this.minPrice.set(String(Math.min(...prices)));
  }

  // 👇 خليها موجودة لو template بيستخدمها
  getMinPrice(): string {
    return this.minPrice();
  }

  getPrice(pharmacyId: string, medicineId: string): number | null {
    return this.data.getMedicinePrice(pharmacyId, medicineId);
  }

  isInStock(pharmacyId: string, medicineId: string): boolean {
    return this.data.isMedicineInStock(pharmacyId, medicineId);
  }

  get formIcon(): string {
    const med = this.medicine();
    if (!med) return 'medication';

    const icons: Record<string, string> = {
      tablet: 'medication',
      capsule: 'medication',
      syrup: 'water_drop',
      injection: 'vaccines',
      cream: 'spa',
      drops: 'opacity',
      inhaler: 'air',
    };

    return icons[med.form] ?? 'medication';
  }

  get stars(): number[] {
    return [0, 1, 2, 3, 4];
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}