import {Inject, Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {DOCUMENT} from "@angular/common";

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
  constructor( @Inject(DOCUMENT) private document: Document, ) {


  }



  connect(url: string): void {



    this.socket = new WebSocket(url);

    this.socket.onopen = () =>{
      this.socket?.send(this.initMessage())
    }

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(event.data)
      const message = JSON.parse(event.data);

      this.messagesSubject.next(message);
      console.log(this.messagesSubject)

    };


    this.socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };


    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }

  initMessage(){
    console.log(JSON.stringify(this.getWsKey()))
    const message = {
      sessionKey:this.getWsKey(),
      message:"start-search"
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
      this.socket.send(JSON.stringify(message));
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
