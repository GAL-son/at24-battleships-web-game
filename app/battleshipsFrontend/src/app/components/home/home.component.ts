import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {StandardButtonComponent} from "../../shared/standard-button/standard-button.component";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    StandardButtonComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private userAccountLink: string;

  constructor(private authService: AuthService) {
    this.userAccountLink = `../account/${this.authService.getCurrentUser().user.name}`;
  }
 getUser(){
    return this.userAccountLink
 }

}
