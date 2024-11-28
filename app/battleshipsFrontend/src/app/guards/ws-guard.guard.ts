import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {WebSocketService} from "../services/websocket/web-socket.service";


@Injectable({
  providedIn: 'root',
})
export class wsGuardGuard implements CanActivate {
  constructor(private wsService: WebSocketService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log(this.wsService.isConnected$)
    return this.wsService.isConnected$.pipe(
      map((isLoggedIn) => {
        if (!isLoggedIn) {
          this.router.navigate(['./home']);
        }
        return isLoggedIn;
      })
    );
  }
}
