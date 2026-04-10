import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent {
  lang = inject(LanguageService);
  auth = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);

  activeTab = signal<'login' | 'register'>('login');
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  registerForm = this.fb.group({
    nameAr: ['', Validators.required],
    nameEn: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    pharmacyName: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue],
  });

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab.set(tab);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onLogin(): void {
    if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      const result = this.auth.login(email!, password!);
      this.isLoading.set(false);

      if (result.success) {
        const user = this.auth.currentUser();
        if (user?.role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user?.role === 'pharmacist') {
          if (user.subscriptionStatus === 'expired') {
            this.router.navigate(['/dashboard/subscription']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.router.navigate(['/']); // Fallback for normal users or unknown roles
        }
      } else {
        this.errorMessage.set(result.message);
      }
    }, 800);
  }

  onRegister(): void {
    if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
    this.isLoading.set(true);
    this.errorMessage.set('');

    setTimeout(() => {
      this.isLoading.set(false);
      this.successMessage.set(this.t(
        'تم إرسال طلبك بنجاح! سيتم مراجعته من قبل الإدارة',
        'Your request was submitted! It will be reviewed by our team.'
      ));
      this.registerForm.reset();
    }, 1000);
  }

  togglePassword(): void { this.showPassword.update(v => !v); }

  t(ar: string, en: string): string { return this.lang.t(ar, en); }
}
