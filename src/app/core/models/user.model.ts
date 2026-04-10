export type UserRole = 'visitor' | 'pharmacist' | 'admin';

export interface User {
  id: string;
  nameAr: string;
  nameEn: string;
  email: string;
  role: UserRole;
  pharmacyId?: string;
  phone?: string;
  licenseNumber?: string;
  isApproved: boolean;
  subscriptionStatus?: 'active' | 'expired' | 'trial';
  subscriptionExpiry?: Date;
  createdAt: Date;
}
