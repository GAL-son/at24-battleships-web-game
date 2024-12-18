import { Component, OnInit } from '@angular/core';
import { GetRankingService } from "../../services/get-ranking.service";
import {RankingTileComponent} from "../../shared/ranking-tile/ranking-tile.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [
    RankingTileComponent,
    NgForOf
  ],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  ranking: any[] = [  ];

  constructor(private getRankingService: GetRankingService) {}

  ngOnInit() {

    this.getRankingService.getRanking().subscribe({
      next: (data: any) => {
        this.ranking = data;
        console.log('Ranking fetched:', this.ranking);
      },
      error: (err) => {
        console.error('Error fetching ranking:', err);
      }
    });
  }
}
