import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {jwtDecode} from "jwt-decode";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  registerUrl = 'http://localhost:3001/api/users/create';
  loginUrl = 'http://localhost:3001/api/session/create';
  changeMailUrl = 'http://localhost:3001/api/session/create';


  private tokenKey = 'authToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private currentUser: any = null

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document, private router: Router) {
  }



  login(name: string, password: string): Observable<any> {
    const localStorage = this.document.defaultView?.localStorage;
    return this.http.post<{ token: string }>(this.loginUrl, {name, password}).pipe(
      tap(response => {
        if (response.token) {
          localStorage?.setItem(this.tokenKey, response.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      catchError(error => {
        alert("Login failed. Please try again.");
        console.error('Login error:', error);
        return of(null);
      })
    );
  }


//
  logout(): void {
    localStorage?.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['../']);
    this.currentUser=null;
  }

  private hasToken(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    return !!localStorage?.getItem(this.tokenKey);
  }

  getToken(): string | null | undefined {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem(this.tokenKey);
  }

  register(name: string, email: string, password: string): Observable<HttpResponse<any>> {
    const body = {name, email, password}; // The key names should match your backend API
    return this.http.post<any>(`${this.registerUrl}`, body, {observe: 'response'});
  }



  private decodeToken(token: string): void {
    try {
      const decoded = jwtDecode(token);
      this.currentUser = decoded;
      console.log('Decoded JWT:', this.currentUser);
    } catch (e) {
      console.error('Error decoding token:', e);
      this.currentUser = null;
    }
  }

  getCurrentUser(): any {
    if (!this.currentUser) {
      const token = this.document.defaultView?.localStorage.getItem(this.tokenKey);
      if (token) {
        this.decodeToken(token);
      }
    }
    return this.currentUser;
  }




}

