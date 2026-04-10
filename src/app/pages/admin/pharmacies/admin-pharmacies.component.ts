import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Pharmacy } from '../../../core/models/pharmacy.model';

@Component({
  selector: 'app-admin-pharmacies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pharmacies.component.html',
  styleUrls: ['./admin-pharmacies.component.scss'] // Reusing common admin table styles
})
export class AdminPharmaciesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);

  pharmacies = signal<Pharmacy[]>(this.data.getPharmacies());

  disablePharmacy(ph: Pharmacy) {
    if (confirm(this.t('هل أنت متأكد من تعطيل هذه الصيدلية؟', 'Are you sure you want to disable this pharmacy?'))) {
      this.pharmacies.update(list => list.map(p => {
        if (p.id === ph.id) {
          return { ...p, subscriptionActive: false }; 
          // Note: Assuming 'Disable' means suspending their subscription/active state in mock
        }
        return p;
      }));
    }
  }

  deletePharmacy(id: string) {
    if (confirm(this.t('لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من الحذف؟', 'This cannot be undone. Are you sure you want to delete?'))) {
      this.pharmacies.update(list => list.filter(p => p.id !== id));
    }
  }

  viewDetails(ph: Pharmacy) {
    alert(this.t(`تفاصيل الصيدلية:\nالاسم: ${ph.nameAr}\nالعنوان: ${ph.addressAr}\nمفتوح: ${ph.isOpen ? 'نعم' : 'لا'}`, `Pharmacy Details:\nName: ${ph.nameEn}\nAddress: ${ph.address}\nOpen: ${ph.isOpen ? 'Yes' : 'No'}`));
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
