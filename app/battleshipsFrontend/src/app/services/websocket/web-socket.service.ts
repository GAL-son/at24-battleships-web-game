import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";
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
  private isConectedToWs = new BehaviorSubject<boolean>(this.hasKey());

  isConnected$ = this.isConectedToWs.asObservable();
  private gameMode: string | null='';

  constructor( @Inject(DOCUMENT) private document: Document,private router:Router ,private gameService:GameService) {


  }



  connect(url: string): void {



    this.socket = new WebSocket(url);

    this.socket.onopen = () =>{
      this.socket?.send(this.initMessage())
    }
//{"serverMessage":"game-update","serverTimestamp":1734191383129,"enemyMove":
// {"moveCoordinates":{"x":2,"y":8}},"wasHit":true,"wasSunk":true,"turn":7,"who":"cw","isYourTurn":false,
// "sunkenShip":[{"x":0,"y":8},{"x":1,"y":8},{"x":2,"y":8}]}

    this.socket.onmessage = (event: MessageEvent) => {
      console.log("ws speaking!")
      console.log(event)
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
          //tobie zniszczono
         // if (message.enemyMove.)

        }
        else{
            if(message.wasHit==true){
              const {x,y}=message.enemyMove.moveCoordinates;
              this.gameService.emitWasHit(x,y)
              //ty zniszczyłeś
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
    if (this.gameMode=="singleplayer"){
      const message = {
        sessionKey:this.getWsKey(),
        message:"start-search",
        gameType: "singleplayer"
      }
      return JSON.stringify(message);
    }else {
      const message = {
        sessionKey: this.getWsKey(),
        message: "start-search"
      }
      return JSON.stringify(message);
    }

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

      return localStorage?.removeItem(this.tokenKey);

  }

  storeData(message: any) {

    this.enemy.name = message.opponent.name;
    this.enemy.score = message.opponent.score;

    this.setup = Object.entries(message.gameSetup.shipSizes).flatMap(([shipType, count]) => {

      const size = Number(shipType);
      const shipCount = Number(count);

      if (isNaN(size) || isNaN(shipCount)) {
        console.error(`Invalid data: shipType=${shipType}, count=${count}`);
        return [];
      }

      return Array(shipCount).fill(size);
    });

    // Debugging logs
    console.log("Setup got set successfully:", this.setup);
    console.log("Enemy name:", this.enemy.name);
    console.log("Enemy score:", this.enemy.score);
    console.log("EOF==");
  }

  private hasKey() {
    if (this.getWsKey()===undefined||this.getWsKey()===null)
    {
      console.log("has no ws key")
      return false;
    }
    else {
      console.log("has ws key")
      console.log(this.getWsKey())
      return true
    }
  }

  setMode(gameMode: string | null) {
    this.gameMode=gameMode

  }
}
