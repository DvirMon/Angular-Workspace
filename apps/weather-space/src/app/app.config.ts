import {
  ApplicationConfig,
  ErrorHandler,
  importProvidersFrom,
} from '@angular/core';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { appRoutes } from './app.routs';
import { ErrorsService } from './shared/services/error.service';

import { provideToastr } from 'ngx-toastr';
import { errorInterceptor } from './shared/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(),
    importProvidersFrom(BrowserModule),
    provideRouter(appRoutes),
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([errorInterceptor]), withFetch()),
    provideToastr(),
    {
      provide: ErrorHandler,
      useClass: ErrorsService,
    },
  ],
};
