import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogService, ActiveDialog } from '../../../core/services/dialog.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-dialog-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Modal Dialog Overlay -->
    @if (dialogService.activeDialog(); as dialog) {
      <div class="dialog-overlay animate-fade-in" (click)="onOverlayClick($event, dialog)" role="dialog" aria-modal="true">
        <div class="dialog-card animate-slide-up" (click)="$event.stopPropagation()">
          
          <div class="dialog-header">
            <div class="dialog-icon" [ngClass]="getIconClass(dialog)">
              <span class="material-icons-round">{{ getIcon(dialog) }}</span>
            </div>
            @if (dialog.title) {
              <h3 class="dialog-title">{{ dialog.title }}</h3>
            }
          </div>

          <div class="dialog-body">
            <p class="dialog-message">{{ dialog.message }}</p>
          </div>

          <div class="dialog-actions">
            @if (dialog.type === 'confirm') {
              <button 
                type="button" 
                class="btn btn-outline" 
                (click)="dialog.resolve(false)">
                {{ dialog.cancelText || (lang.isArabic ? 'إلغاء' : 'Cancel') }}
              </button>
              <button 
                type="button" 
                class="btn" 
                [ngClass]="dialog.isDanger ? 'btn-danger' : 'btn-primary'" 
                (click)="dialog.resolve(true)">
                {{ dialog.confirmText || (lang.isArabic ? 'تأكيد' : 'Confirm') }}
              </button>
            } @else {
              <button 
                type="button" 
                class="btn btn-primary" 
                (click)="dialog.resolve(true)">
                {{ dialog.okText || (lang.isArabic ? 'حسناً' : 'OK') }}
              </button>
            }
          </div>

        </div>
      </div>
    }

    <!-- Toast Notifications Container -->
    @if (dialogService.toasts().length > 0) {
      <div class="toast-container" aria-live="polite">
        @for (toast of dialogService.toasts(); track toast.id) {
          <div class="toast-item animate-slide-up" [ngClass]="'toast-' + toast.type">
            <span class="material-icons-round toast-icon">{{ toast.icon }}</span>
            <span class="toast-text">{{ toast.message }}</span>
            <button type="button" class="toast-close" (click)="dialogService.removeToast(toast.id)" aria-label="Close">
              <span class="material-icons-round">close</span>
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal, 400);
      padding: var(--space-md);
    }

    .dialog-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 460px;
      max-height: min(90vh, 600px);
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-xl);
      overflow: hidden;
    }

    .dialog-header {
      padding: var(--space-xl) var(--space-xl) var(--space-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: var(--space-md);
    }

    .dialog-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;

      span {
        font-size: 2rem;
      }

      &.icon-primary {
        background: rgba(12, 115, 184, 0.12);
        color: var(--dawa-primary);
      }

      &.icon-success {
        background: rgba(16, 185, 129, 0.12);
        color: var(--dawa-success);
      }

      &.icon-warning {
        background: rgba(245, 158, 11, 0.12);
        color: var(--dawa-warning);
      }

      &.icon-danger {
        background: rgba(229, 57, 53, 0.12);
        color: var(--dawa-danger);
      }

      &.icon-info {
        background: rgba(12, 115, 184, 0.12);
        color: var(--dawa-primary);
      }
    }

    .dialog-title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
      line-height: 1.3;
    }

    .dialog-body {
      padding: 0 var(--space-xl) var(--space-lg);
      overflow-y: auto;
      text-align: center;
    }

    .dialog-message {
      color: var(--text-secondary);
      font-size: var(--font-size-base);
      line-height: 1.6;
      white-space: pre-line;
      margin: 0;
    }

    .dialog-actions {
      padding: var(--space-md) var(--space-xl) var(--space-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      border-top: 1px solid var(--border-muted);
      background: var(--bg-hover);

      .btn {
        min-width: 110px;
      }

      .btn-danger {
        background: var(--dawa-danger);
        color: #fff;
        box-shadow: 0 4px 12px rgba(229, 57, 53, 0.25);
        &:hover {
          background: #d32f2f;
        }
      }
    }

    /* Toast Notification Styles */
    .toast-container {
      position: fixed;
      bottom: var(--space-xl);
      inset-inline-end: var(--space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      z-index: var(--z-toast, 500);
      max-width: 400px;
      width: calc(100% - 2rem);
      pointer-events: none;

      @media (max-width: 640px) {
        bottom: var(--space-md);
        inset-inline-end: var(--space-md);
      }
    }

    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      border: 1px solid var(--border-default);
      box-shadow: var(--shadow-lg);
      color: var(--text-primary);
      font-size: var(--font-size-sm);
      font-weight: 500;
      line-height: 1.4;

      &.toast-success {
        border-inline-start: 4px solid var(--dawa-success);
        .toast-icon { color: var(--dawa-success); }
      }
      &.toast-error {
        border-inline-start: 4px solid var(--dawa-danger);
        .toast-icon { color: var(--dawa-danger); }
      }
      &.toast-warning {
        border-inline-start: 4px solid var(--dawa-warning);
        .toast-icon { color: var(--dawa-warning); }
      }
      &.toast-info {
        border-inline-start: 4px solid var(--dawa-primary);
        .toast-icon { color: var(--dawa-primary); }
      }
    }

    .toast-icon {
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .toast-text {
      flex: 1;
    }

    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2px;
      border-radius: var(--radius-sm);
      transition: color var(--transition-fast);

      &:hover {
        color: var(--text-primary);
      }

      span {
        font-size: 1.125rem;
      }
    }
  `]
})
export class DialogContainerComponent {
  dialogService = inject(DialogService);
  lang = inject(LanguageService);

  @HostListener('window:keydown.escape')
  onEscape() {
    const active = this.dialogService.activeDialog();
    if (active) {
      active.resolve(false);
    }
  }

  onOverlayClick(event: MouseEvent, dialog: ActiveDialog) {
    if (event.target === event.currentTarget) {
      dialog.resolve(false);
    }
  }

  getIcon(dialog: ActiveDialog): string {
    if (dialog.icon) return dialog.icon;
    if (dialog.isDanger) return 'warning';
    if (dialog.type === 'confirm') return 'help_outline';
    if (dialog.type === 'success') return 'check_circle';
    if (dialog.type === 'warning') return 'warning';
    if (dialog.type === 'error') return 'error';
    return 'info';
  }

  getIconClass(dialog: ActiveDialog): string {
    if (dialog.isDanger) return 'icon-danger';
    if (dialog.type === 'confirm') return 'icon-warning';
    if (dialog.type === 'success') return 'icon-success';
    if (dialog.type === 'warning') return 'icon-warning';
    if (dialog.type === 'error') return 'icon-danger';
    return 'icon-info';
  }
}
