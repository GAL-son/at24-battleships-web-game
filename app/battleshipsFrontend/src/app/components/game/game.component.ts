import {Component, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {GridComponent} from "../../shared/grid/grid.component";

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
export class GameComponent {

  @ViewChild('gridObj') gridComponent!: GridComponent;
  grid = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hasShip: false }))
  );
  shipSizes = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]; // Remaining ships to place
  shipsPlaced: any[] = []; // Array to store placed ships
  currentShipSize = this.shipSizes[0]; // Start with the largest ship
  horizontal:boolean=true;

  // Handle when a ship is successfully placed
  onShipPlaced(success: JSON): void {
    if (success) {
      console.log(this.shipSizes[0])
      this.shipsPlaced.push(success);
      console.log(this.shipsPlaced)
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
    console.log(this.gridComponent)
    this.gridComponent.clear()
    this.shipSizes = [4, 4, 3, 2, 2, 2, 1, 1, 1, 1];
    this.currentShipSize = this.shipSizes[0]
  }

  changeOrientation() {
    this.horizontal=!this.horizontal;
  }

  private addShipToList() {

  }
}
