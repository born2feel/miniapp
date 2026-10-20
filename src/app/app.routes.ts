import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Sign in',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        title: 'My account',
        loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'cards',
        title: 'Bonus cards',
        loadComponent: () => import('./pages/cards/cards.page').then((m) => m.CardsPage),
      },
      {
        path: 'bookings',
        title: 'My bookings',
        loadComponent: () => import('./pages/bookings/bookings.page').then((m) => m.BookingsPage),
      },
      {
        path: 'subscriptions',
        title: 'Packages',
        loadComponent: () =>
          import('./pages/subscriptions/subscriptions.page').then((m) => m.SubscriptionsPage),
      },
      {
        path: 'visits',
        title: 'Visits',
        loadComponent: () => import('./pages/visits/visits.page').then((m) => m.VisitsPage),
      },
      {
        path: 'referral',
        title: 'Referral program',
        loadComponent: () => import('./pages/referral/referral.page').then((m) => m.ReferralPage),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
