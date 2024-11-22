import {Component, OnInit} from '@angular/core';
import {LobbyServiceService} from "../../services/lobby-service.service";
import {GetRankingService} from "../../services/get-ranking.service";
import {WebSocketService} from "../../services/websocket/web-socket.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-game-lobby',
  standalone: true,
  imports: [],
  templateUrl: './game-lobby.component.html',
  styleUrl: './game-lobby.component.css'
})
export class GameLobbyComponent implements  OnInit{
  sessionkey: string = "";
  private wsSubscription: Subscription = new Subscription(); // to handle WebSocket subscriptions

  constructor(
    private getLobbyService: LobbyServiceService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getLobbyService.startGame().subscribe({
      next: (data: any) => {
        this.sessionkey = data.sessionKey;
        console.log('Session key fetched:', this.sessionkey);
        this.webSocketService.setWsKey(this.sessionkey)
        this.webSocketService.connect('ws://localhost:3001'); // Provide your WebSocket URL here

        this.wsSubscription = this.webSocketService.messages$.subscribe((message) => {
          if (message.serverMessage === 'game-found') {
            console.log('GameFount!!');
            console.log('Game found:', message);
            this.webSocketService.storeData(message)
            this.router.navigate(['/game']); // Navigate to the game component
          }
        });
      },
      error: (err) => {
        console.error('Error fetching session key:', err);
      }
    });
  }



}
