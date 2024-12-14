import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private enemyMoveSubject = new Subject<{ x: number; y: number }>();
  private wasHitSubject = new Subject<{ x: number; y: number }>();
  private enemyHitSubject = new Subject<{ x: number; y: number }>();
  private hitYouSubject = new Subject<{ x: number; y: number }>();
  enemyMove$ = this.enemyMoveSubject.asObservable();
  wasHit$ = this.wasHitSubject.asObservable();
  enemyHit$=this.enemyHitSubject.asObservable();

  hitYou$=this.hitYouSubject.asObservable();
  won:boolean=false;


  emitEnemyMove(x: number, y: number): void {
    //thisone 'shoots your field'
    this.enemyMoveSubject.next({ x, y });
  }
  emitWasHit(x: number, y: number): void {
    this.wasHitSubject.next({ x, y });
  }
  emitEnemyHit(x:number,y:number):void
  {
    //thisone shoots ant enemy board
    this.enemyHitSubject.next({x,y});
  }
  emitHitYou(x:number,y:number):void
  {
    this.hitYouSubject.next({x,y});
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
