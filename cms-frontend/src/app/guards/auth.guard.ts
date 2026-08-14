import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LoginService } from '../services/login.service'; // Apne login service ka path check kar lein

export const authGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Check karein ki user logged in hai ya nahi (token exist karta hai ya nahi)
  if (loginService.isLoggedIn()) {
    return true; // Agar login hai toh page access karne dega
  } else {
    // Agar login nahi hai, toh user ko login page par bhej dega
    router.navigate(['/login']);
    return false;
  }
};