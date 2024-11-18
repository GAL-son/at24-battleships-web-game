import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  if (typeof window !== 'undefined' && window.localStorage) {
    console.log("used")
    const authToken = localStorage.getItem('authToken');
    console.log("authtoken"+authToken)
    if (authToken) {

      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)

      });
      return next(cloned);
    }
  }else
  {
    console.log("unused")
  }
  return next(req); // Proceed without modification if localStorage is not available
}
