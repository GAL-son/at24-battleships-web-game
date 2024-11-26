import {Inject, Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {DOCUMENT} from "@angular/common";
import {Router} from "@angular/router";
import {GameService} from "../game.service";
import {GamePlayingComponent} from "../../components/game-playing/game-playing.component";

interface GameSetup {
[key:number]:number
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;
  private messagesSubject: Subject<any> = new Subject<any>();
  private tokenKey="WStoken";
  setup:number[]=[]
  enemy={name:'',score:''}

  constructor( @Inject(DOCUMENT) private document: Document,private router:Router ,private gameService:GameService) {


  }



  connect(url: string): void {



    this.socket = new WebSocket(url);

    this.socket.onopen = () =>{
      this.socket?.send(this.initMessage())
    }

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("ws speaking!")
      console.log(event.data)
      const message = JSON.parse(event.data);

      this.messagesSubject.next(message);
      console.log(this.messagesSubject)
      if (message.serverMessage==='game-started'){
        console.log("caught event game started")
        console.log(message.isYourTurn)
        if (message.isYourTurn==true)
        {
          console.log("this one has priority")
          this.gameService.yourTurn=true;
        }
        this.goToGame(message)
      }
      if(message.serverMessage==="game-update"){
        if (message.isYourTurn===true)
        {
          this.gameService.yourTurn=true;
          const {x,y}=message.enemyMove.moveCoordinates;
          this.gameService.emitEnemyMove(x,y)

        }
        else{
            if(message.wasHit==true){
              const {x,y}=message.enemyMove.moveCoordinates;
              this.gameService.emitWasHit(x,y)
            }
        }
      }if(message.serverMessage=="game-ended")
      {
        this.gameService.won=message.didYouWon;
        this.router.navigate(['./result'])
      }

    };


    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };


    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  private goToGame(message:any) {
    this.router.navigate(['./playing'])
  }

  initMessage(){
    console.log(JSON.stringify(this.getWsKey()))
    const message = {
      sessionKey:this.getWsKey(),
      message:"start-search"
    }
    return JSON.stringify(message);
  }
  shipsMessage(shipsData:any[]){
    console.log(JSON.stringify(this.getWsKey()))
    const ships = shipsData.map(ship => ({
      shipSize: ship.size,
      position: { x: ship.x, y: ship.y },
      vertically: !ship.horizontal,
    }));
    const message = {
      sessionKey:this.getWsKey(),
      message:"set-ships",
      ships:ships


    }
    return JSON.stringify(message);
  }
  shotMessage(x:number,y:number){
    const message = {
      sessionKey:this.getWsKey(),
      message:"move",
      move:{
        moveCoordinates:{
          x:x,
          y:y
        }
      }
    }
    return JSON.stringify(message);
  }
  setWsKey(token:string)
  {
    console.log("seting key"+token)
    localStorage?.setItem(this.tokenKey, token);
  }
  getWsKey(){
    return localStorage?.getItem(this.tokenKey);
  }

  get messages$() {
    return this.messagesSubject.asObservable();
  }


  sendMessage(message: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
    else {
      console.log("slot not ready")
    }
  }


  closeConnection(): void {
    if (this.socket) {
      this.socket.close();
    }
  }

  storeData(message: any) {

      this.enemy.name=message.opponent.name;
      this.enemy.score=message.opponent.score;
      this.setup = Object.entries(message.gameSetup as GameSetup).flatMap(([shipType, count]) =>
      Array(count).fill(Number(shipType))
    );
      console.log("setup got setted")
    console.log("setting"+this.setup)
    console.log("enemy"+this.enemy.name)
    console.log("enemy"+this.enemy.score)
    console.log("EOF==")

  }
}
