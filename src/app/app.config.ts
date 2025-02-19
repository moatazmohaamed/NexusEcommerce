import { loaderInterceptor } from './core/interceptors/loader/loader.interceptor';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { routes } from './app.routes';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { api_url } from './core/custom_injections/apiUrl';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { headersInterceptor } from './core/interceptors/headers/headers.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { errorsInterceptor } from './core/interceptors/errors/errors.interceptor';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './shared/enviroments/enviroment.prod';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withViewTransitions()
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        headersInterceptor,
        errorsInterceptor,
        loaderInterceptor,
      ])
    ),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule,
      NgxSpinnerModule
    ),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideAnimations(),
    {
      provide: api_url,
      useValue: 'https://ecommerce.routemisr.com/api/v1',
    },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {},
    }),
    provideToastr(),
  ],
};
