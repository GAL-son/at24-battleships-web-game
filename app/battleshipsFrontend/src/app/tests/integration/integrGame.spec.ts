import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamePlayingComponent } from '../../components/game-playing/game-playing.component';
import { WebSocketService } from '../../services/websocket/web-socket.service';
import { GameService } from '../../services/game.service';
import { ChangeDetectorRef } from '@angular/core';
import { of } from 'rxjs';

// Jasmine spies for mocking
describe('GamePlayingComponent Integration Tests', () => {
  let component: GamePlayingComponent;
  let fixture: ComponentFixture<GamePlayingComponent>;
  let wsService: jasmine.SpyObj<WebSocketService>;
  let gameService: jasmine.SpyObj<GameService>;
  let cdr: ChangeDetectorRef;

  beforeEach(async () => {
    // Arrange: Tworzymy zmockowane usługi
    wsService = jasmine.createSpyObj('WebSocketService', ['sendMessage', 'shotMessage']);
    wsService.shotMessage.and.callFake((x: number, y: number) => JSON.stringify({ x, y }));

    gameService = jasmine.createSpyObj('GameService', [
      'yourTurn',
      'emitEnemyMove',
      'emitWasHit',
      'emitEnemyHit',
      'emitHitYou',
      'getShips',
      'getEnemy',
    ]);

    gameService.getEnemy.and.returnValue({ name: 'enemy', score: 100 });
    gameService.enemyMove$ = of({ x: 1, y: 2 });
    gameService.wasHit$ = of({ x: 3, y: 4 });
    gameService.enemyHit$ = of({ x: 5, y: 6 });
    gameService.hitYou$ = of({ x: 7, y: 8 });

    gameService.getShips.and.returnValue([
      { x: 1, y: 1, size: 3, horizontal: true },
      { x: 3, y: 3, size: 2, horizontal: false },
    ]);

    // Act: Konfigurujemy TestBed z komponentem i providerami
    await TestBed.configureTestingModule({
      imports: [
        GamePlayingComponent,
      ],
      providers: [
        { provide: WebSocketService, useValue: wsService },
        { provide: GameService, useValue: gameService },
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlayingComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    // Cleanup po każdym teście
  });

  //TI_09
  //test 1: Sprawdzanie, czy komponent poprawnie subskrybuje obiekty typu observable w inicjalizacji komponentu
  it('should subscribe to observables without throwing an error', () => {
    // Arrange: Przygotowanie do testu
    expect(() => {
      // Act: Wywołanie ngOnInit
      component.ngOnInit();
    }).not.toThrow(); // Assert: Sprawdzanie, czy nie wyrzucony jest błąd
  });


  //TI_10
  //Sprawdzenie wysłania odpowiedzi i oznaczenia kratki na polu po strzale wroga
  it('should send a WebSocket message and mark grid shot on enemy shot', () => {
    // Arrange: Przygotowanie mockowanej planszy i danych testowych
    // @ts-ignore
    component.gridComponentE = { grid: Array(10).fill(null).map(() => Array(10).fill({ shot: false })) };

    const mockShot = { x: 4, y: 5 };

    // Act: Symulacja uderzenia przeciwnika
    component.onEnemyShot(mockShot);

    // Assert: Sprawdzanie, czy wiadomość została wysłana przez WebSocketService
    expect(wsService.sendMessage).toHaveBeenCalledWith(wsService.shotMessage(mockShot.x, mockShot.y));

    // Assert: Sprawdzanie, czy strzał został zaznaczony na planszy
    expect(component.gridComponentE.grid[mockShot.y][mockShot.x].shot).toBeTrue();
  });
});
