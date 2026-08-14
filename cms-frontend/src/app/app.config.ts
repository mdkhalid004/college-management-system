import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor'; 
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withFetch(), // Modern Angular fetch API enable karne ke liye
      withInterceptors([authInterceptor, tokenInterceptor]) // Sabhi interceptors yahan ek sath array me rahenge
    )
  ]
};