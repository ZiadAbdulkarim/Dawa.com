import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { Medicine } from '../../core/models/medicine.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);

  medicines = signal<Medicine[]>([]);
  stats = { views: 1284, searches: 347, pharmacies: 1, rating: 4.7 };

  ngOnInit(): void {
    const pharmacyId = this.auth.currentUser()?.pharmacyId;
    if (pharmacyId) {
      this.medicines.set(this.data.getMedicinesForPharmacy(pharmacyId));
    }
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
