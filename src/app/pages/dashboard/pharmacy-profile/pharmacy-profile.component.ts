import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Pharmacy } from '../../../core/models/pharmacy.model';

@Component({
  selector: 'app-pharmacy-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pharmacy-profile.component.html',
  styleUrls: ['./pharmacy-profile.component.scss']
})
export class PharmacyProfileComponent implements OnInit {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);

  pharmacy = signal<Pharmacy | undefined>(undefined);

  ngOnInit(): void {
    const phId = this.auth.currentUser()?.pharmacyId;
    if (phId) {
      this.pharmacy.set(this.data.getPharmacyById(phId));
    }
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
