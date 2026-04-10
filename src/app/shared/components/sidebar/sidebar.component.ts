import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { DataService } from '../../../core/services/data.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  lang = inject(LanguageService);
  data = inject(DataService);

  @Input() selectedCategory: string | null = null;

  categories: Category[] = this.data.getCategories();
  stats = this.data.getStats();

  cities = ['القاهرة / Cairo', 'الإسكندرية / Alexandria', 'الجيزة / Giza'];
  selectedCity: string | null = null;

  filterByCity(city: string): void {
    this.selectedCity = this.selectedCity === city ? null : city;
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
