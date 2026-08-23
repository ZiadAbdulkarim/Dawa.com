import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Pharmacy } from '../../../core/models/pharmacy.model';

import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-admin-pharmacies',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-pharmacies.component.html',
  styleUrls: ['./admin-pharmacies.component.scss']
})
export class AdminPharmaciesComponent {
  lang = inject(LanguageService);
  data = inject(DataService);
  dialog = inject(DialogService);

  pharmacies = signal<Pharmacy[]>(this.data.getPharmacies());

  async disablePharmacy(ph: Pharmacy) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تعطيل الصيدلية', 'Disable Pharmacy'),
      message: this.t('هل أنت متأكد من تعطيل هذه الصيدلية؟', 'Are you sure you want to disable this pharmacy?'),
      isDanger: true,
      confirmText: this.t('تعطيل', 'Disable'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.pharmacies.update(list => list.map(p => {
        if (p.id === ph.id) {
          return { ...p, subscriptionActive: false }; 
        }
        return p;
      }));
      this.dialog.toast(this.t('تم تعطيل الصيدلية', 'Pharmacy disabled'), 'warning');
    }
  }

  async deletePharmacy(id: string) {
    const confirmed = await this.dialog.confirm({
      title: this.t('تأكيد الحذف', 'Confirm Deletion'),
      message: this.t('لا يمكن التراجع عن هذا الإجراء. هل أنت متأكد من الحذف؟', 'This action cannot be undone. Are you sure you want to delete?'),
      isDanger: true,
      confirmText: this.t('حذف', 'Delete'),
      cancelText: this.t('إلغاء', 'Cancel')
    });

    if (confirmed) {
      this.pharmacies.update(list => list.filter(p => p.id !== id));
      this.dialog.toast(this.t('تم حذف الصيدلية بنجاح', 'Pharmacy deleted successfully'), 'success');
    }
  }

  viewDetails(ph: Pharmacy) {
    const details = this.lang.isArabic
      ? `الاسم: ${ph.nameAr}\nالمدينة: ${ph.cityAr || ph.city}\nالمنطقة: ${ph.areaAr || ph.area}\nالعنوان: ${ph.addressAr || ph.address}\nالهاتف: ${ph.phone}\nمفتوح الآن: ${ph.isOpen ? 'نعم' : 'لا'}`
      : `Name: ${ph.nameEn}\nCity: ${ph.city}\nArea: ${ph.area}\nAddress: ${ph.address}\nPhone: ${ph.phone}\nCurrently Open: ${ph.isOpen ? 'Yes' : 'No'}`;

    this.dialog.alert({
      title: this.t('تفاصيل الصيدلية', 'Pharmacy Details'),
      message: details,
      icon: 'storefront',
      type: 'info'
    });
  }

  t(ar: string, en: string): string {
    return this.lang.t(ar, en);
  }
}
