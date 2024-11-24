import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingTileComponent } from './ranking-tile.component';

describe('RankingTileComponent', () => {
  let component: RankingTileComponent;
  let fixture: ComponentFixture<RankingTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingTileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RankingTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
