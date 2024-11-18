import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  if (typeof window !== 'undefined' && window.localStorage) {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next(cloned);
    }
  }
  return next(req); // Proceed without modification if localStorage is not available
}
