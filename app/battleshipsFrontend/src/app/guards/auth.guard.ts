import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log(this.authService.isLoggedIn$)
    return this.authService.isLoggedIn$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['']);
        }
        return isLoggedIn;
      })
    );
  }
}
