import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';

import { MedicineImageComponent } from '../../../shared/components/medicine-image/medicine-image.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterModule, MedicineImageComponent],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);

  totalMedicines = signal(0);
  stats = { views: 1284, searches: 347, rating: 4.7 };
  mostViewed = signal<Medicine[]>([]);

  ngOnInit(): void {
    const pharmacyId = this.auth.currentUser()?.pharmacyId;
    if (pharmacyId) {
      const allMeds = this.data.getMedicinesForPharmacy(pharmacyId);
      this.totalMedicines.set(allMeds.length);
      // Mocking most viewed medicines
      this.mostViewed.set(allMeds.slice(0, 3));
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
