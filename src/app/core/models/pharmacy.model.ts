import { PharmacyMedicineEntry } from './medicine.model';

export interface Pharmacy {
  id: string;
  nameAr: string;
  nameEn: string;
  city: string;
  cityAr: string;
  area: string;
  areaAr: string;
  address: string;
  addressAr: string;
  phone: string;
  workingHours: string;
  workingHoursAr: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  latitude?: number;
  longitude?: number;
  logoUrl?: string;
  isVerified: boolean;
  subscriptionActive: boolean;   // Only active subscribers shown to visitors
  medicineEntries: PharmacyMedicineEntry[];
  /** @deprecated use medicineEntries */
  medicineIds?: string[];
}
