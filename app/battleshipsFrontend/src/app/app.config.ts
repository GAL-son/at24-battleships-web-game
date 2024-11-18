import { ApplicationConfig } from '@angular/core';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor} from "./interceptors/auth.interceptor";
// import { xsrfInterceptorFn } from './xsrf/xsrf.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor]),withFetch())
  ]
};
