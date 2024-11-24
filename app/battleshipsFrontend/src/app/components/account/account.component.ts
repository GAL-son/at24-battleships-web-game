import {Component} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
   userName: string | null=null;
   userData: any=null;

  constructor(private route: ActivatedRoute, private authService: AuthService,private router:Router) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.userName = params.get('name');
      if (this.userName) {
        this.fetchUserData(this.userName);
      }
    });
  }

  test($event: MouseEvent) {
    $event.preventDefault();
    let user = this.authService.getCurrentUser()
    console.log(user.user.name)
  }


  fetchUserData(userName: string): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.user && currentUser.user.name === userName) {
      this.userData = currentUser.user;
    } else {
      console.log(`User ${userName} data not found in JWT`);
      this.router.navigate(['../home'])
    }
  }

  removeAcc($event: MouseEvent) {
    $event.preventDefault();
    console.log("tbd")
  }
}
