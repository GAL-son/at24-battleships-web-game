import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {GridComponent} from "../../shared/grid/grid.component";
import {WebSocketService} from "../../services/websocket/web-socket.service";

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
  constructor(private wsService: WebSocketService) {
  }

  @ViewChild('gridObj') gridComponent!: GridComponent;
  grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hasShip: false }))
  );
  shipSizes:number[] = []; // Remaining ships to place
  shipsPlaced: any[] = []; // Array to store placed ships
  currentShipSize = this.shipSizes[0]; // Start with the largest ship
  horizontal:boolean=true;



  // Handle when a ship is successfully placed
  onShipPlaced(success: JSON): void {
    if (success) {
      console.log(success)
      console.log(this.shipSizes[0])
      this.shipsPlaced.push(success);
      console.log("ships"+this.shipsPlaced)
      this.shipSizes.shift(); // Remove the placed ship size from the array
      this.currentShipSize = this.shipSizes[0] || 0; // Update current size or finish

      if (this.shipSizes.length === 0) {
        console.log('All ships placed! Ready to start the game.');
      }
    }
  }
  startGame() {

  }

  reset() {
   // console.log(this.gridComponent)
    this.gridComponent.clear()
    this.shipSizes=this.wsService.setup;
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
