import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { DataService } from '../../core/services/data.service';
import { Pharmacy } from '../../core/models/pharmacy.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent {
  lang = inject(LanguageService);
  data = inject(DataService);

  activeTab = signal<'overview' | 'pharmacies' | 'users'>('overview');
  pharmacies = signal<Pharmacy[]>(this.data.getPharmacies());
  stats = this.data.getStats();

  mockUsers: User[] = [
    { id: 'u1', nameAr: 'أحمد فاروق', nameEn: 'Ahmed Farouk', email: 'pharmacist@dawa.com', role: 'pharmacist', isApproved: true, subscriptionStatus: 'active', createdAt: new Date('2024-01-01') },
    { id: 'u2', nameAr: 'منى إبراهيم', nameEn: 'Mona Ibrahim', email: 'admin@dawa.com', role: 'admin', isApproved: true, createdAt: new Date('2023-01-01') },
    { id: 'u3', nameAr: 'محمد علاء', nameEn: 'Mohamed Alaa', email: 'ph2@dawa.com', role: 'pharmacist', isApproved: false, subscriptionStatus: 'trial', createdAt: new Date('2024-03-15') },
  ];

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
