import { Inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class GetRankingService {
  url = 'http://localhost:3001/api/users';

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) {}


  getRanking() {
    return this.http.get(this.url);
  }
}
