import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import {StandardButtonComponent} from "../../shared/standard-button/standard-button.component";

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

}
