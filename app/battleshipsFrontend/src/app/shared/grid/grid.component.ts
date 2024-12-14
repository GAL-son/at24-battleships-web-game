import {Component, input, Input, OnInit, Output} from '@angular/core';
import {Console} from "inspector";
import {NgForOf} from "@angular/common";
import {EventEmitter} from "@angular/core";
import {error} from "@angular/compiler-cli/src/transformers/util";
import {emit} from "@angular-devkit/build-angular/src/tools/esbuild/angular/compilation/parallel-worker";
import {GameService} from "../../services/game.service";


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
  @Input() grid: { hasShip: boolean,shot:boolean }[][] = [];
  @Input() currentShipSize!: number; // Size of the ship to place
  @Input() mode!:string;
  @Input() horizontal!: boolean;
  @Output() shipPlaced = new EventEmitter<JSON>();
  @Output() onEnemyClicked = new EventEmitter<{ x: number; y: number }>();


constructor(private gameService:GameService) {
}

  handleClick(x:number,y:number)
  {
    if (this.mode=="placing")
    {
      this.placeShip(x,y);
    }
    if (this.mode=="you")
    {
      this.clickedOwn(x,y);
    }
    if (this.mode=="enemy")
    {
      this.clickedEnemy(x,y);
    }
  }
  placeShip(x: number, y: number) {
    if (!this.isValidPlacement(x, y)||this.currentShipSize==0) {
      console.log('Invalid placement, try again!');
      return false; // Ship cannot be placed
    }


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
    const boardSize = 10;

    if (this.horizontal) {
      // Check if the ship fits within the grid
      if (x + this.currentShipSize > boardSize) return false;

      // Check for ships directly in the placement area
      for (let i = 0; i < this.currentShipSize; i++) {
        if (this.grid[y][x + i].hasShip) return false; // Ship is already placed here

        // Check diagonals
        if (y > 0 && this.grid[y - 1][x + i].hasShip) return false; // Top diagonal
        if (y < boardSize - 1 && this.grid[y + 1][x + i].hasShip) return false; // Bottom diagonal
      }

      // Check horizontal neighbors outside the ship's placement
      if (x > 0) {
        if (this.grid[y][x - 1].hasShip) return false; // Left
        if (y > 0 && this.grid[y - 1][x - 1].hasShip) return false; // Top-left diagonal
        if (y < boardSize - 1 && this.grid[y + 1][x - 1].hasShip) return false; // Bottom-left diagonal
      }
      if (x + this.currentShipSize < boardSize) {
        if (this.grid[y][x + this.currentShipSize].hasShip) return false; // Right
        if (y > 0 && this.grid[y - 1][x + this.currentShipSize].hasShip) return false; // Top-right diagonal
        if (y < boardSize - 1 && this.grid[y + 1][x + this.currentShipSize].hasShip) return false; // Bottom-right diagonal
      }
    } else {
      // Check if the ship fits within the grid
      if (y + this.currentShipSize > boardSize) return false;

      // Check for ships directly in the placement area
      for (let i = 0; i < this.currentShipSize; i++) {
        if (this.grid[y + i][x].hasShip) return false; // Ship is already placed here

        // Check diagonals
        if (x > 0 && this.grid[y + i][x - 1].hasShip) return false; // Left diagonal
        if (x < boardSize - 1 && this.grid[y + i][x + 1].hasShip) return false; // Right diagonal
      }

      // Check vertical neighbors outside the ship's placement
      if (y > 0) {
        if (this.grid[y - 1][x].hasShip) return false; // Above
        if (x > 0 && this.grid[y - 1][x - 1].hasShip) return false; // Top-left diagonal
        if (x < boardSize - 1 && this.grid[y - 1][x + 1].hasShip) return false; // Top-right diagonal
      }
      if (y + this.currentShipSize < boardSize) {
        if (this.grid[y + this.currentShipSize][x].hasShip) return false; // Below
        if (x > 0 && this.grid[y + this.currentShipSize][x - 1].hasShip) return false; // Bottom-left diagonal
        if (x < boardSize - 1 && this.grid[y + this.currentShipSize][x + 1].hasShip) return false; // Bottom-right diagonal
      }
    }

    return true;
  }

  public clear() {
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        this.grid[y][x].hasShip = false;
      }
    }
  }

  ngOnInit(): void {
    // console.log(this.gameService.getShips());
    //
    // const ships = this.gameService.getShips();
    // for (const ship of ships) {
    //   const { x, y, size, horizontal } = ship;
    //   for (let i = 0; i < size; i++) {
    //     if (horizontal) {
    //       this.grid[y][x + i].hasShip = true;
    //     } else {
    //       this.grid[y + i][x].hasShip = true;
    //     }
    //   }
    // }
  }

  private clickedOwn(x: number, y: number) {
    console.log("clicked Own")
    return;

  }

  private clickedEnemy(x: number, y: number) {

    if (!this.gameService.yourTurn||this.grid[y][x].shot==true)
    {return}
    this.onEnemyClicked.emit({y,x});

  }
  getCellClass(cell: { hasShip: boolean; shot: boolean }): string {
    if (cell.hasShip && cell.shot) {
      return 'ship-and-shot';
    }
    if (cell.hasShip) {
      return 'ship';
    }
    if (cell.shot) {
      return 'shot';
    }
    return '';
  }
}
