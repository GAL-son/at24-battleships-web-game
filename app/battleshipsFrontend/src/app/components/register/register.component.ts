import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  Register(event: Event) {
    event.preventDefault();
    console.log(`registration: mail=${this.email}, username=${this.username}, password=${this.password}`);
    this.authService.register(this.username, this.email, this.password).subscribe((response: HttpResponse<any>) => {
      console.log('Response received:', response);
      if (response && response.status === 201) {
        console.log('Registration successful');
        this.router.navigate(['../login']);
      } else {
        console.log('Unexpected response status:', response.status);
      }
    }, (error) => {
      console.error('Registration failed:', error);
    });
  }

  goToLogin(event: Event
  ) {
    event.preventDefault();
    console.log("going to login");
    this.router.navigate(['../login']);
  }
}
