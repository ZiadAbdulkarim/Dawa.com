import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { DialogContainerComponent } from './shared/components/dialog-container/dialog-container.component';
import { ThemeService } from './core/services/theme.service';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, DialogContainerComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-dialog-container></app-dialog-container>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: var(--bg-base);
      color: var(--text-primary);
      transition: background-color 0.4s ease, color 0.4s ease;
    }
  `]
})
export class AppComponent implements OnInit {
  // Eagerly inject services so they initialize immediately
  private theme = inject(ThemeService);
  private lang = inject(LanguageService);

  ngOnInit(): void {
    // Services initialize in their constructors via localStorage,
    // but we call them here to ensure they're available app-wide.
  }
}
