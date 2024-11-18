// src/app/auth.interceptor.ts
import {HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService} from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    console.log("Adding token to headers");
    const authReq = req.clone({
      setHeaders: {
        'x-access-token': `Bearer ${token}`
      }
    });
    return next(authReq);
  } else {
    return next(req);
  }
};
