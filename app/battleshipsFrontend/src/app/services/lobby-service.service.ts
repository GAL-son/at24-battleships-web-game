import {Inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class LobbyServiceService {

  url='http://localhost:3001/api/session/game/create'
  private yourShips=[];


  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {}
  startGame() {
    return this.http.post(this.url,{});
  }


}
