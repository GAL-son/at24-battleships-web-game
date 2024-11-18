import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {



  username = '';
  password = '';
  constructor(private authService: AuthService, private router: Router) {}

  logIn(event: Event) {
    this.authService.login(this.username, this.password).subscribe((result) => {
      if (result) {
        this.router.navigate(['/dashboard']); // Redirect on successful login
      }
    });
  }

  goToRegistration(event: Event) {
    event.preventDefault(); // Explicitly prevent form submission
    console.log("going to registration"); // Check if this logs without a reload
    this.router.navigate(['../register']);
  }
}
