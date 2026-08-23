export interface Medicine {
  id: string;
  nameAr: string;
  nameEn: string;
  genericNameAr: string;
  genericNameEn: string;
  category: string;
  categoryId: string;
  descriptionAr: string;
  descriptionEn: string;
  usesAr: string[];
  usesEn: string[];
  sideEffectsAr: string[];
  sideEffectsEn: string[];
  imageGradient: string;      // CSS gradient for visual card
  imageIcon: string;          // Material icon name
  imageUrl?: string;          // Public asset path, e.g. /assets/images/medicines/paracetamol.jpeg
  availableCount: number;
  requiresPrescription: boolean;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'drops' | 'inhaler';
  strength: string;
  basePrice: number;          // Base price in EGP
}

export interface PharmacyMedicineEntry {
  medicineId: string;
  price: number;              // Price in EGP at this pharmacy
  inStock: boolean;
}
