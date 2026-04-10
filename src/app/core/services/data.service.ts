import { Injectable, signal } from '@angular/core';
import { Medicine } from '../models/medicine.model';
import { Pharmacy } from '../models/pharmacy.model';
import { Category } from '../models/category.model';
import { MOCK_CATEGORIES, MOCK_MEDICINES, MOCK_PHARMACIES } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class DataService {
  private medicines = signal<Medicine[]>(MOCK_MEDICINES);
  private pharmacies = signal<Pharmacy[]>(MOCK_PHARMACIES);
  private categories = signal<Category[]>(MOCK_CATEGORIES);

  getCategories(): Category[] { return this.categories(); }
  getMedicines(): Medicine[] { return this.medicines(); }
  getPharmacies(): Pharmacy[] { return this.pharmacies(); }

  /** Only pharmacies with active subscriptions (visible to visitors) */
  getActivePharmacies(): Pharmacy[] {
    return this.pharmacies().filter(p => p.subscriptionActive);
  }

  getMedicineById(id: string): Medicine | undefined {
    return this.medicines().find(m => m.id === id);
  }

  getPharmacyById(id: string): Pharmacy | undefined {
    return this.pharmacies().find(p => p.id === id);
  }

  searchMedicines(query: string): Medicine[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.medicines();
    return this.medicines().filter(m =>
      m.nameAr.includes(query) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.genericNameAr.includes(query) ||
      m.genericNameEn.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  getMedicinesByCategory(categoryId: string): Medicine[] {
    return this.medicines().filter(m => m.categoryId === categoryId);
  }

  /** Pharmacies that carry a medicine and have ACTIVE subscription */
  getPharmaciesForMedicine(medicineId: string): Pharmacy[] {
    return this.getActivePharmacies().filter(p =>
      p.medicineEntries.some(e => e.medicineId === medicineId)
    );
  }

  /** Get the price of a medicine at a specific pharmacy */
  getMedicinePrice(pharmacyId: string, medicineId: string): number | null {
    const ph = this.getPharmacyById(pharmacyId);
    if (!ph) return null;
    const entry = ph.medicineEntries.find(e => e.medicineId === medicineId);
    return entry ? entry.price : null;
  }

  /** Check if a medicine is in stock at a specific pharmacy */
  isMedicineInStock(pharmacyId: string, medicineId: string): boolean {
    const ph = this.getPharmacyById(pharmacyId);
    if (!ph) return false;
    const entry = ph.medicineEntries.find(e => e.medicineId === medicineId);
    return entry?.inStock ?? false;
  }

  getMedicinesForPharmacy(pharmacyId: string): Medicine[] {
    const pharmacy = this.getPharmacyById(pharmacyId);
    if (!pharmacy) return [];
    const ids = pharmacy.medicineEntries.map(e => e.medicineId);
    return this.medicines().filter(m => ids.includes(m.id));
  }

  getStats() {
    return {
      totalMedicines: this.medicines().length,
      totalPharmacies: this.pharmacies().length,
      activePharmacies: this.getActivePharmacies().length,
      totalCategories: this.categories().length,
      cities: [...new Set(this.pharmacies().map(p => p.city))].length,
    };
  }
}
