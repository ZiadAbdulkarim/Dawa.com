import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-admin-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {
  lang = inject(LanguageService);
  data = inject(DataService);

  stats = this.data.getStats();

  // Mocking subscription metrics based on the data service active pharmacies
  get activeSubscriptionsCount() {
    return this.data.getActivePharmacies().length;
  }

  get expiredSubscriptionsCount() {
    return this.stats.totalPharmacies - this.data.getActivePharmacies().length;
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
