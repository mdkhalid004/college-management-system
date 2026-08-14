import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // LocalStorage se token nikalen
  const token = localStorage.getItem('authToken');

  // Agar token available hai, toh request me headers add kar dein
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  // Agar token nahi hai, toh request ko waise hi bhej dein
  return next(req);
};