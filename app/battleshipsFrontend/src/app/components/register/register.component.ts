import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpResponse} from "@angular/common/http";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  Register(event: Event) {
    event.preventDefault();
    console.log(`registration: mail=${this.email}, username=${this.username}, password=${this.password}`);

    this.authService.register(this.username, this.email, this.password).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['../login']);
      },
      (error) => {
        console.error('Error occurred during registration:', error);
        if (error.status === 400) {
          this.errorMessage = 'Username already taken. Please choose a different one.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }

  goToLogin(event: Event
  ) {
    event.preventDefault();
    console.log("going to login");
    this.router.navigate(['../login']);
  }
}
