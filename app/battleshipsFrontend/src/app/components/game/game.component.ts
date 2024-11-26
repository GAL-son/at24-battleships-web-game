import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {GridComponent} from "../../shared/grid/grid.component";
import {WebSocketService} from "../../services/websocket/web-socket.service";
import {Router} from "@angular/router";
import {GameService} from "../../services/game.service";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    NgForOf,
    GridComponent,
    NgIf
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  constructor(private wsService: WebSocketService,private router: Router,private gameService:GameService) {
  }

  @ViewChild('gridObj') gridComponent!: GridComponent;

  grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hasShip: false,shot:false }))
  );
  shipSizes:number[] = [];
  shipsPlaced: any[] = [];
  currentShipSize = this.shipSizes[0];
  horizontal:boolean=true;







  onShipPlaced(success: JSON): void {
    if (success) {
      console.log(success)
      console.log(this.shipSizes[0])
      this.shipsPlaced.push(success);
      console.log("ships"+this.shipsPlaced)
      this.shipSizes.shift();
      this.currentShipSize = this.shipSizes[0] || 0;

      if (this.shipSizes.length === 0) {
        console.log('All ships placed! Ready to start the game.');
      }
    }
  }
  startGame() {

    this.gameService.setData(this.shipsPlaced,this.wsService.enemy.name)
    console.log("navigating to Game")
    this.wsService.sendMessage(this.wsService.shipsMessage(this.shipsPlaced))
    //this.router.navigate(['/playing']);

  }

  reset() {
   // console.log(this.gridComponent)
    this.gridComponent.clear()
    this.shipSizes=[...this.wsService.setup];
    this.currentShipSize = this.shipSizes[0]
    console.log(this.shipSizes)
    console.log("in service:"+this.wsService.setup)
    this.shipsPlaced=[]
  }

  changeOrientation() {
    this.horizontal=!this.horizontal;
  }

  private addShipToList() {

  }

  ngOnInit(): void {

    this.shipSizes=[...this.wsService.setup];
    this.currentShipSize=this.shipSizes[0]

    console.log(this.shipSizes)
    console.log("name",this.wsService.enemy.name)

  }
}
