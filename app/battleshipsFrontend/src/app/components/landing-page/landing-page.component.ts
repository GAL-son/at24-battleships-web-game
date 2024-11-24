import { Component } from '@angular/core';
import {StandardButtonComponent} from "../../shared/standard-button/standard-button.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
    imports: [
        StandardButtonComponent
    ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
