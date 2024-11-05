import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}

  logIn(event: Event) {
    event.preventDefault(); // Explicitly prevent form submission
    console.log("Logging in without page reload"); // Check if this logs without a reload
    this.router.navigate(['../home']);
  }

  goToRegistration(event: Event) {
    event.preventDefault(); // Explicitly prevent form submission
    console.log("going to registration"); // Check if this logs without a reload
    this.router.navigate(['../register']);
  }
}
