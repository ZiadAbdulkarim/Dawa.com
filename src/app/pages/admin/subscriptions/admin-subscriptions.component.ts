import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

import { DialogService } from '../../../core/services/dialog.service';

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
  dialog = inject(DialogService);
  datePipe = inject(DatePipe);

  pharmacists = signal<User[]>([]);

  ngOnInit() {
    this.pharmacists.set(this.auth.getMockUsers().filter(u => u.role === 'pharmacist'));
  }

  async activate(user: User) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تفعيل الاشتراك', 'Activate Subscription'),
      message: this.t('هل تريد تفعيل هذا الاشتراك؟', 'Do you want to activate this subscription?'),
      confirmText: this.t('تفعيل', 'Activate'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.pharmacists.update(users => users.map(u => {
        if (u.id === user.id) {
          const newExpiry = u.subscriptionExpiry && u.subscriptionExpiry > new Date() ? u.subscriptionExpiry : new Date(new Date().setFullYear(new Date().getFullYear() + 1));
          return { ...u, subscriptionStatus: 'active', subscriptionExpiry: newExpiry };
        }
        return u;
      }));
      this.dialog.toast(this.t('تم تفعيل الاشتراك بنجاح', 'Subscription activated successfully'), 'success');
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
    this.dialog.alert({
      title: this.t('تمديد الاشتراك', 'Extend Subscription'),
      message: this.t('تم تمديد الاشتراك لمدة عام بنجاح.', 'Subscription extended by 1 year successfully.'),
      type: 'success'
    });
  }

  async disable(user: User) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تعطيل الاشتراك', 'Disable Subscription'),
      message: this.t('هل أنت متأكد من تعطيل وإيقاف هذا الاشتراك؟', 'Are you sure you want to disable this subscription?'),
      isDanger: true,
      confirmText: this.t('تعطيل', 'Disable'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.pharmacists.update(users => users.map(u => {
        if (u.id === user.id) {
          return { ...u, subscriptionStatus: 'expired' };
        }
        return u;
      }));
      this.dialog.toast(this.t('تم تعطيل الاشتراك', 'Subscription disabled'), 'warning');
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
