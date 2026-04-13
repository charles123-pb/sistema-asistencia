import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
<<<<<<< HEAD
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
=======
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
import { routes } from './app.routes';
import { ApiInterceptor } from './core/interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideAnimationsAsync(),
<<<<<<< HEAD
    provideHttpClient(withInterceptorsFromDi()),
=======
    provideHttpClient(),
>>>>>>> 19a6882794dac5f16f97657b3e0ff2dd323ec598
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
    },
  ]
};
