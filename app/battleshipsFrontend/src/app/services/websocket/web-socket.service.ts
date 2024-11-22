import {Inject, Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  private socket: WebSocket | null = null;
  private messagesSubject: Subject<any> = new Subject<any>();
  private tokenKey="WStoken";
  constructor( @Inject(DOCUMENT) private document: Document, ) {


  }



  connect(url: string): void {

    this.socket = new WebSocket(url);

    this.socket.onopen = () =>{
      this.socket?.send(this.initMessage())
    }

    this.socket.onmessage = (event: MessageEvent) => {

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
      message:"game-search"
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
}
