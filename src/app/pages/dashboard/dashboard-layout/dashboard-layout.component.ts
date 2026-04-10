import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.scss']
})
export class DashboardLayoutComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);

  get isExpired(): boolean {
    return this.auth.currentUser()?.role === 'pharmacist' && this.auth.currentUser()?.subscriptionStatus === 'expired';
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
