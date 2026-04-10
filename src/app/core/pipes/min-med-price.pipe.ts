import { Pipe, PipeTransform } from '@angular/core';
import { Pharmacy } from '../models/pharmacy.model';
import { DataService } from '../services/data.service';

@Pipe({ name: 'minMedPrice', standalone: true })
export class MinMedPricePipe implements PipeTransform {
  transform(pharmacies: Pharmacy[], medicineId: string, data: DataService): string {
    const prices = pharmacies
      .map(p => data.getMedicinePrice(p.id, medicineId))
      .filter((p): p is number => p !== null);
    if (!prices.length) return '–';
    return String(Math.min(...prices));
  }
}
