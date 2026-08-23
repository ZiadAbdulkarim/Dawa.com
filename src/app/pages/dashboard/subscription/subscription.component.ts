import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  providers: [DatePipe]
})
export class SubscriptionComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  dialog = inject(DialogService);
  datePipe = inject(DatePipe);

  // Manage UI state for 'renewing' simulation
  isRenewing = signal(false);

  get isExpired(): boolean {
    return this.auth.currentUser()?.subscriptionStatus === 'expired';
  }

  renew() {
    this.isRenewing.set(true);
    setTimeout(() => {
      this.isRenewing.set(false);
      this.dialog.alert({
        title: this.t('تم التجديد بنجاح', 'Renewal Successful'),
        message: this.t('تم تجديد الاشتراك بنجاح! شكراً لك.', 'Subscription renewed successfully! Thank you.'),
        type: 'success'
      });
    }, 1500);
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
