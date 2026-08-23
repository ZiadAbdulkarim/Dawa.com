import { Component, inject, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';
import { Medicine } from '../../../core/models/medicine.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  theme = inject(ThemeService);
  lang = inject(LanguageService);
  auth = inject(AuthService);
  data = inject(DataService);
  router = inject(Router);

  searchQuery = '';
  suggestions = signal<Medicine[]>([]);
  showSuggestions = signal(false);
  mobileMenuOpen = signal(false);
  isScrolled = signal(false);

  @HostListener('window:scroll')
  onScroll() { this.isScrolled.set(window.scrollY > 10); }

  get isHomePage(): boolean {
    const url = this.router.url.split('?')[0];
    return url === '/' || url === '';
  }

  onSearchInput(): void {
    if (this.searchQuery.length >= 2) {
      this.suggestions.set(this.data.searchMedicines(this.searchQuery).slice(0, 6));
      this.showSuggestions.set(true);
    } else {
      this.showSuggestions.set(false);
    }
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.showSuggestions.set(false);
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
    }
  }

  selectSuggestion(med: Medicine): void {
    this.searchQuery = this.lang.isArabic ? med.nameAr : med.nameEn;
    this.showSuggestions.set(false);
    this.router.navigate(['/medicine', med.id]);
  }

  closeSuggestions(): void {
    setTimeout(() => this.showSuggestions.set(false), 200);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
