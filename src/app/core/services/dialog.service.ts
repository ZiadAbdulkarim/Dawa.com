import { Injectable, signal } from '@angular/core';

export interface DialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  okText?: string;
  isDanger?: boolean;
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm';
  icon?: string;
}

export interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon: string;
}

export interface ActiveDialog extends DialogOptions {
  resolve: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  activeDialog = signal<ActiveDialog | null>(null);
  toasts = signal<ToastItem[]>([]);
  private toastCounter = 0;

  confirm(options: DialogOptions | string): Promise<boolean> {
    const config: DialogOptions = typeof options === 'string' 
      ? { message: options, type: 'confirm' } 
      : { type: 'confirm', ...options };

    return new Promise<boolean>((resolve) => {
      this.activeDialog.set({
        ...config,
        resolve: (result: boolean) => {
          this.activeDialog.set(null);
          resolve(result);
        }
      });
    });
  }

  alert(options: DialogOptions | string): Promise<void> {
    const config: DialogOptions = typeof options === 'string' 
      ? { message: options, type: 'info' } 
      : { type: options.type || 'info', ...options };

    return new Promise<void>((resolve) => {
      this.activeDialog.set({
        ...config,
        resolve: () => {
          this.activeDialog.set(null);
          resolve();
        }
      });
    });
  }

  toast(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', duration = 3500): void {
    const id = ++this.toastCounter;
    let icon = 'check_circle';
    if (type === 'error') icon = 'error';
    if (type === 'warning') icon = 'warning';
    if (type === 'info') icon = 'info';

    const item: ToastItem = { id, message, type, icon };
    this.toasts.update(current => [...current, item]);

    setTimeout(() => {
      this.removeToast(id);
    }, duration);
  }

  removeToast(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}
