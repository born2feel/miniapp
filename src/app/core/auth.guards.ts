import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionStore } from './session.store';

/** Lets the client in only after phone sign-in and starts loading the profile. */
export const authGuard: CanActivateFn = () => {
  const store = inject(SessionStore);
  if (!store.phone()) {
    return inject(Router).createUrlTree(['/login']);
  }
  store.ensureLoaded();
  return true;
};

/** Sends an already signed-in client straight to the home screen. */
export const guestGuard: CanActivateFn = () =>
  inject(SessionStore).phone() ? inject(Router).createUrlTree(['/']) : true;
