import { Injectable, signal } from '@angular/core';
import { User, UserRole } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'dawa_auth';
  currentUser = signal<User | null>(null);

  // Mock user store
  private readonly MOCK_USERS: User[] = [
    {
      id: 'user-1',
      nameAr: 'أحمد فاروق',
      nameEn: 'Ahmed Farouk',
      email: 'pharmacist@dawa.com',
      role: 'pharmacist',
      pharmacyId: 'ph-1',
      phone: '01001234567',
      licenseNumber: 'LIC-2024-001',
      isApproved: true,
      subscriptionStatus: 'active',
      subscriptionExpiry: new Date('2025-12-31'),
      createdAt: new Date('2024-01-01'),
    },
    {
      id: 'user-2',
      nameAr: 'منى إبراهيم',
      nameEn: 'Mona Ibrahim',
      email: 'admin@dawa.com',
      role: 'admin',
      isApproved: true,
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 'user-3',
      nameAr: 'صيدلية الصحة',
      nameEn: 'Al Seha Pharmacy',
      email: 'expired@dawa.com',
      role: 'pharmacist',
      pharmacyId: 'ph-8',
      isApproved: true,
      subscriptionStatus: 'expired',
      subscriptionExpiry: new Date('2023-12-31'),
      createdAt: new Date('2023-01-01'),
    }
  ];

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        this.currentUser.set(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }

  getMockUsers(): User[] {
    return this.MOCK_USERS;
  }

  login(email: string, _password: string): { success: boolean; message: string } {
    const user = this.MOCK_USERS.find(u => u.email === email);
    if (!user) return { success: false, message: 'البريد الإلكتروني غير موجود | Email not found' };
    if (!user.isApproved) return { success: false, message: 'الحساب قيد المراجعة | Account pending review' };

    this.currentUser.set(user);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return { success: true, message: 'تم تسجيل الدخول | Logged in successfully' };
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  get isLoggedIn(): boolean { return !!this.currentUser(); }
  get role(): UserRole | null { return this.currentUser()?.role ?? null; }
  get isAdmin(): boolean { return this.currentUser()?.role === 'admin'; }
  get isPharmacist(): boolean { return this.currentUser()?.role === 'pharmacist'; }
}
