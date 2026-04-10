import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly STORAGE_KEY = 'dawa_theme';
  theme = signal<Theme>('light');

  constructor() {
    this.init();
  }

  private init(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial: Theme = saved ?? (prefersDark ? 'dark' : 'light');
    this.applyTheme(initial);
  }

  toggle(): void {
    this.applyTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(t: Theme): void {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem(this.STORAGE_KEY, t);
  }

  get isDark(): boolean { return this.theme() === 'dark'; }
}
