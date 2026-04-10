import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss'],
  providers: [DatePipe]
})
export class AdminSubscriptionsComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  datePipe = inject(DatePipe);

  pharmacists = signal<User[]>([]);

  ngOnInit() {
    this.pharmacists.set(this.auth.getMockUsers().filter(u => u.role === 'pharmacist'));
  }

  activate(user: User) {
    if (confirm(this.t('هل تريد تفعيل هذا الاشتراك؟', 'Do you want to activate this subscription?'))) {
      this.pharmacists.update(users => users.map(u => {
        if (u.id === user.id) {
          const newExpiry = u.subscriptionExpiry && u.subscriptionExpiry > new Date() ? u.subscriptionExpiry : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          return { ...u, subscriptionStatus: 'active', subscriptionExpiry: newExpiry };
        }
        return u;
      }));
    }
  }

  extend(user: User) {
    this.pharmacists.update(users => users.map(u => {
      if (u.id === user.id && u.subscriptionExpiry) {
        const ext = new Date(u.subscriptionExpiry);
        ext.setFullYear(ext.getFullYear() + 1);
        return { ...u, subscriptionExpiry: ext, subscriptionStatus: 'active' };
      }
      return u;
    }));
    alert(this.t('تم تمديد الاشتراك لمدة عام بنجاح.', 'Subscription extended by 1 year successfully.'));
  }

  disable(user: User) {
    if (confirm(this.t('هل أنت متأكد من تعطيل وإيقاف هذا الاشتراك؟', 'Are you sure you want to disable this subscription?'))) {
      this.pharmacists.update(users => users.map(u => {
        if (u.id === user.id) {
          return { ...u, subscriptionStatus: 'expired' };
        }
        return u;
      }));
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
