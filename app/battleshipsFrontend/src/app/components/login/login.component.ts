import {Component} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from "../../services/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {


  name = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  Login(event: Event) {
    event.preventDefault();
    console.log(`login attempt: username=${this.name}, password=${this.password}`);
    this.authService.login(this.name, this.password).subscribe((response) => {
      if (response) {
        console.log('Login successful:', response);
        //this.authService.getCurrentUser()
        this.router.navigate(['../home']);
      } else {
        console.log('Login failed.');
      }
    }, (error) => {
      console.error('Login error:', error);
    });
  }


  goToRegistration(event:Event) {
    event.preventDefault(); // Explicitly prevent form submission
    console.log("going to registration"); // Check if this logs without a reload
    this.router.navigate(['../register']);
  }
}
