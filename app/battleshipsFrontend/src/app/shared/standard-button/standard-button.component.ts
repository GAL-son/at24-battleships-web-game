import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-standard-button',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './standard-button.component.html',
  styleUrl: './standard-button.component.css'
})
export class StandardButtonComponent {
  @Input() label: string = '';  // Label for the button
  @Input() link: string = '';    // Link for router navigation
}
