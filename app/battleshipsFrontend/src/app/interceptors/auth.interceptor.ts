import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
  console.log('Intercepted request headers:', req.headers);
  if (typeof window !== 'undefined' && window.localStorage) {
    const authToken = localStorage.getItem('authToken');
    console.log("authtokennull", authToken);
    console.log("used")
    if (authToken&&authToken!==null) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`),
      });
      return next(cloned);
    }
  }
  return next(req);
}
