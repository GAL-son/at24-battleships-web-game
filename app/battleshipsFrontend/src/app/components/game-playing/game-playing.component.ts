import {ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {GridComponent} from "../../shared/grid/grid.component";
import {GameService} from "../../services/game.service";
import {NgIf} from "@angular/common";
import {WebSocketService} from "../../services/websocket/web-socket.service";
interface ShotSuccess {
  x: number;
  y: number;
}


@Component({
  selector: 'app-game-playing',
  standalone: true,
  imports: [
    GridComponent,
    NgIf
  ],
  templateUrl: './game-playing.component.html',
  styleUrl: './game-playing.component.css'
})
export class GamePlayingComponent {
  @ViewChild('gridObjY') gridComponentY!: GridComponent;
  @ViewChild('gridObjE') gridComponentE!: GridComponent;

  constructor(private cdr: ChangeDetectorRef, private gameService:GameService,private wsService:WebSocketService) {
  }
  gridY = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hasShip: false,shot:false }))
  );
  gridE = Array.from({ length: 10 }, () =>
    Array.from({ length: 10 }, () => ({ hasShip: false,shot:false }))
  );

  getTurn()
  {
    return this.gameService.yourTurn;
  }
  onClickedYourBoard(success: JSON): void {
    console.log("clicked you")
  }
  onClickedEnemyBoard(success: JSON): void {
    console.log("clicked enemy")
  }
  getEnemy()
  {
    return this.gameService.getEnemy();
  }
  gotShot(x:number,y:number){
    this.gridY[x][y].shot=true;
  }

  onEnemyShot(success: ShotSuccess): void {
    if (success) {
      this.wsService.sendMessage(this.wsService.shotMessage(success.x,success.y))
      this.gameService.yourTurn=false;
      console.log(success)

      //this.gridComponentE.grid[success.y][success.x].hasShip=true
      this.gridComponentE.grid[success.y][success.x].shot=true
      console.log(this.gridE[success.y][success.x])
      this.cdr.detectChanges();

    }
  }
  ngOnInit(): void {


    this.gameService.enemyMove$.subscribe(({x,y})=>{
      this.gameService.yourTurn=true;
      this.gotShot(y,x);
    })
    this.gameService.wasHit$.subscribe(({x,y})=>{
      this.gridE[y][x].hasShip=true;
    })
    this.gameService.enemyHit$.subscribe(({x,y})=>{
      this.gridE[y][x].shot=true;
    })
    this.gameService.hitYou$.subscribe(({x,y})=>{
      this.gridY[y][x].shot=true;
    })


    console.log(this.gameService.getShips());

    const ships = this.gameService.getShips();
    for (const ship of ships) {
      const { x, y, size, horizontal } = ship;
      for (let i = 0; i < size; i++) {
        if (horizontal) {
          this.gridY[y][x + i].hasShip = true;
        } else {
          this.gridY[y + i][x].hasShip = true;
        }
      }
    }

  }


}
