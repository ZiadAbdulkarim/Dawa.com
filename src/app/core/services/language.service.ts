import { Injectable, signal } from '@angular/core';

export type Language = 'ar' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'dawa_lang';
  lang = signal<Language>('ar');

  constructor() {
    this.init();
  }

  private init(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Language | null;
    this.applyLanguage(saved ?? 'ar');
  }

  toggle(): void {
    this.applyLanguage(this.lang() === 'ar' ? 'en' : 'ar');
  }

  setLanguage(lang: Language): void {
    this.applyLanguage(lang);
  }

  private applyLanguage(lang: Language): void {
    this.lang.set(lang);
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    if (lang === 'ar') {
      body.classList.remove('lang-en');
      body.classList.add('lang-ar');
    } else {
      body.classList.remove('lang-ar');
      body.classList.add('lang-en');
    }

    localStorage.setItem(this.STORAGE_KEY, lang);
  }

  get isArabic(): boolean { return this.lang() === 'ar'; }
  get isRTL(): boolean { return this.lang() === 'ar'; }

  /** Returns the appropriate string based on current language */
  t(ar: string, en: string): string {
    return this.lang() === 'ar' ? ar : en;
  }
}
