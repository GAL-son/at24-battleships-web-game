import { Component } from '@angular/core';
import {GameService} from "../../services/game.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  won:boolean=false;

  constructor(private gameService:GameService) {
    this.won=gameService.won;
  }
}
