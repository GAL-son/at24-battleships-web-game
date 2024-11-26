import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private enemyMoveSubject = new Subject<{ x: number; y: number }>();
  enemyMove$ = this.enemyMoveSubject.asObservable();

  emitEnemyMove(x: number, y: number): void {
    this.enemyMoveSubject.next({ x, y });
  }


  private ships:any[]=[]
  private enemy={name:"",score: 0}
   yourTurn:boolean=false;
  constructor() { }

  setData(shipsPlaced: any[], name: string) {

    this.ships=shipsPlaced;
    this.enemy.name=name;
  }
  getShips()
  {
    return this.ships
  }
  getEnemy()
  {
    return this.enemy;
  }
}
