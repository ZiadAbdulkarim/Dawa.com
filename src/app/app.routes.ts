import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';
import { activeSubscriptionGuard } from './core/guards/subscription.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-results/search-results.component').then(m => m.SearchResultsComponent),
  },
  {
    path: 'medicine/:id',
    loadComponent: () => import('./pages/medicine-detail/medicine-detail.component').then(m => m.MedicineDetailComponent),
  },
  {
    path: 'pharmacy/:id',
    loadComponent: () => import('./pages/pharmacy-detail/pharmacy-detail.component').then(m => m.PharmacyDetailComponent),
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./pages/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/overview/overview.component').then(m => m.OverviewComponent),
        canActivate: [activeSubscriptionGuard]
      },
      {
        path: 'manage',
        loadComponent: () => import('./pages/dashboard/manage-medicines/manage-medicines.component').then(m => m.ManageMedicinesComponent),
        canActivate: [activeSubscriptionGuard]
      },
      {
        path: 'add',
        loadComponent: () => import('./pages/dashboard/add-medicine/add-medicine.component').then(m => m.AddMedicineComponent),
        canActivate: [activeSubscriptionGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/pharmacy-profile/pharmacy-profile.component').then(m => m.PharmacyProfileComponent),
        canActivate: [activeSubscriptionGuard]
      },
      {
        path: 'subscription',
        loadComponent: () => import('./pages/dashboard/subscription/subscription.component').then(m => m.SubscriptionComponent)
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'medicines',
        loadComponent: () => import('./pages/admin/medicines/admin-medicines.component').then(m => m.AdminMedicinesComponent)
      },
      {
        path: 'pharmacies',
        loadComponent: () => import('./pages/admin/pharmacies/admin-pharmacies.component').then(m => m.AdminPharmaciesComponent)
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./pages/admin/subscriptions/admin-subscriptions.component').then(m => m.AdminSubscriptionsComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/admin/categories/admin-categories.component').then(m => m.AdminCategoriesComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
  },
];
