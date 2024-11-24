import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AsyncPipe, NgIf} from "@angular/common";
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf],
  templateUrl: './bar.component.html',
  styleUrl: './bar.component.css'
})
export class BarComponent {

  constructor(public authService: AuthService) {}
  onLogout() {
    this.authService.logout();

  }
}
