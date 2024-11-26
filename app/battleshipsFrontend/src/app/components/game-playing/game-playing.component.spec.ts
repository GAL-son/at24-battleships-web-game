import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayingComponent } from './game-playing.component';

describe('GamePlayingComponent', () => {
  let component: GamePlayingComponent;
  let fixture: ComponentFixture<GamePlayingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamePlayingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamePlayingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
