import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceBackend } from '../services/auth-backend.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthServiceBackend);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthServiceBackend);
  const router = inject(Router);
  if (auth.isAdmin()) return true;
  return router.createUrlTree(['/courses']);
};

export const teacherGuard: CanActivateFn = () => {
  const auth = inject(AuthServiceBackend);
  const router = inject(Router);
  if (auth.isLoggedIn() && !auth.isAdmin()) return true;
  return router.createUrlTree(['/admin']);
};
