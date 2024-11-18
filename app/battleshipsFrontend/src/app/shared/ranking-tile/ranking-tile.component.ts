import {Component, input, Input} from '@angular/core';

@Component({
  selector: 'app-ranking-tile',
  standalone: true,
  imports: [],
  templateUrl: './ranking-tile.component.html',
  styleUrl: './ranking-tile.component.css'
})
export class RankingTileComponent {
  @Input() number: string = '';
  @Input() name: string = '';  // Label for the button
  @Input() score: string = '';    // Link for router navigation

}
