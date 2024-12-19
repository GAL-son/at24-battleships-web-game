import { Component } from '@angular/core';
import {GameService} from "../../services/game.service";
import {NgIf} from "@angular/common";
import {StandardButtonComponent} from "../../shared/standard-button/standard-button.component";
import {WebSocketService} from "../../services/websocket/web-socket.service";

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    NgIf,
    StandardButtonComponent
  ],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent {
  won:boolean=false;

  constructor(private gameService:GameService,private wsService:WebSocketService) {
    this.won=gameService.won;
    this.wsService.closeConnection();
  }
}
