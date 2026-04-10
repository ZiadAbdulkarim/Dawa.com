import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

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
      // In a real app this would trigger an API call. Here we just show a message.
      alert(this.t('تم تجديد الاشتراك بنجاح! شكراً لك.', 'Subscription renewed successfully! Thank you.'));
      // Note: we are not mutating the mock data permanently as it would require 
      // updating Auth mock state deeply which isn't necessary for the UI mockup.
      // A reload of the mock might be needed or just keep the alert.
    }, 1500);
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
