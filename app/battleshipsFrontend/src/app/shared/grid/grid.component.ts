import {Component, Input, OnInit, Output} from '@angular/core';
import {Console} from "inspector";
import {NgForOf} from "@angular/common";
import {EventEmitter} from "@angular/core";
import {error} from "@angular/compiler-cli/src/transformers/util";


@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})


export class GridComponent implements OnInit {
  @Input() grid: { hasShip: boolean }[][] = [];
  @Input() currentShipSize!: number; // Size of the ship to place
  @Input() horizontal!: boolean;
  @Output() shipPlaced = new EventEmitter<JSON>();


  placeShip(x: number, y: number) {
    // First, check if the placement is valid
    if (!this.isValidPlacement(x, y)||this.currentShipSize==0) {
      console.log('Invalid placement, try again!');
      return false; // Ship cannot be placed
    }

    // Place the ship (if valid)
    if (this.horizontal) {
      for (let i = 0; i < this.currentShipSize; i++) {
        this.grid[y][x + i].hasShip = true;
      }
    } else {
      for (let i = 0; i < this.currentShipSize; i++) {
        this.grid[y + i][x].hasShip = true;
      }
    }
    const shipData = {
      x: x,
      y: y,
      size: this.currentShipSize,
      horizontal: this.horizontal,
    };
    this.shipPlaced.emit(JSON.parse(JSON.stringify(shipData)));
  return ;
  }


  isValidPlacement(x: number, y: number): boolean {
    if (this.horizontal) {
      // Check if the ship fits horizontally
      if (x + this.currentShipSize > 10) return false; // Ship doesn't fit

      // Check for adjacent ships (horizontal check)
      for (let i = 0; i < this.currentShipSize; i++) {
        if (this.grid[y][x + i].hasShip) {
          return false; // Ship is already placed here
        }
      }

      // Check surrounding cells for the horizontal placement
      // Check above and below the ship
      for (let i = 0; i < this.currentShipSize; i++) {
        if (y > 0 && this.grid[y - 1][x + i].hasShip) return false; // Above
        if (y < 9 && this.grid[y + 1][x + i].hasShip) return false; // Below
      }

      // Check the cells to the left and right of the ship (for adjacency)
      if (x > 0 && this.grid[y][x - 1].hasShip) return false; // Left
      if (x + this.currentShipSize < 10 && this.grid[y][x + this.currentShipSize].hasShip) return false; // Right

    } else {
      // Check if the ship fits vertically
      if (y + this.currentShipSize > 10) return false; // Ship doesn't fit

      // Check for adjacent ships (vertical check)
      for (let i = 0; i < this.currentShipSize; i++) {
        if (this.grid[y + i][x].hasShip) {
          return false; // Ship is already placed here
        }
      }

      // Check surrounding cells for the vertical placement
      // Check left and right of the ship
      for (let i = 0; i < this.currentShipSize; i++) {
        if (x > 0 && this.grid[y + i][x - 1].hasShip) return false; // Left
        if (x < 9 && this.grid[y + i][x + 1].hasShip) return false; // Right
      }

      // Check cells above and below the ship
      if (y > 0 && this.grid[y - 1][x].hasShip) return false; // Above
      if (y + this.currentShipSize < 10 && this.grid[y + this.currentShipSize][x].hasShip) return false; // Below
    }

    return true; // Valid placement
  }

  public clear() {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.grid[y][x].hasShip = false;
      }
    }
  }

  ngOnInit(): void {
  }
}
