import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {BarComponent} from "./components/bar/bar.component";
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'battleshipsFrontend';
}
