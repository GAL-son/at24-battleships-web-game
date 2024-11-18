import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {}

  login(username: string, password: string): Observable<any> {
    const localStorage = this.document.defaultView?.localStorage;
    const dummyApiUrl = 'https://dummyapi.io/auth/login';

    return this.http.post<{ token: string }>(dummyApiUrl, { username, password }).pipe(
      tap(response => {
        if (response.token) {
          localStorage?.setItem(this.tokenKey, response.token);
          this.isLoggedInSubject.next(true);
        }
      }),
      catchError(() => {
        alert("Login failed. Please try again.");
        return of(null); // Handle error and return null observable
      })
    );
  }
  logout(): void {
    localStorage?.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
  }

  private hasToken(): boolean {
    const localStorage = this.document.defaultView?.localStorage;
    return !!localStorage?.getItem(this.tokenKey);
  }

  getToken(): string | null|undefined {
    const localStorage = this.document.defaultView?.localStorage;
    return localStorage?.getItem(this.tokenKey);
  }

}
