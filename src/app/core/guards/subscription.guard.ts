import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const activeSubscriptionGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  
  const user = auth.currentUser();
  
  // Admin bypasses this
  if (user?.role === 'admin') return true;

  // Check if pharmacist subscription is expired
  if (user?.role === 'pharmacist' && user.subscriptionStatus === 'expired') {
    router.navigate(['/dashboard/subscription']);
    return false;
  }
  
  return true;
};
