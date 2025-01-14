import { TestBed, ComponentFixture } from '@angular/core/testing';
import { GridComponent } from '../../shared/grid/grid.component';
import { GameService } from '../../services/game.service';
import { EventEmitter } from '@angular/core';

describe('GridComponent (Integration Tests)', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;
  let mockGameService: any;

  beforeEach(() => {
    // Arrange: Tworzymy mock dla GameService z domyślnymi ustawieniami
    mockGameService = {
      yourTurn: true, // Symulujemy, że tura użytkownika jest aktywna
    };

    // Konfigurujemy TestBed z komponentem GridComponent jako standalone
    // oraz dodajemy mock GameService do testów
    TestBed.configureTestingModule({
      imports: [GridComponent], // Używamy `imports`, aby zaimportować standalone component
      providers: [{ provide: GameService, useValue: mockGameService }],
    }).compileComponents();

    // Tworzymy instancję komponentu i przygotowujemy środowisko testowe
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;

    // Tworzymy przykładową 10x10 planszę testową z pustymi komórkami
    component.grid = Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ hasShip: false, shot: false }))
    );

    // Ustawiamy domyślne parametry komponentu
    component.currentShipSize = 3;
    component.mode = 'placing';
    component.horizontal = true;

    // Aktualizujemy wykrywanie zmian w komponencie
    fixture.detectChanges();
  });

  // Test 1: Sprawdzanie, czy komponent został utworzony poprawnie
  it('should create the component', () => {
    // Act & Assert: Sprawdzanie, czy komponent został utworzony
    expect(component).toBeTruthy();
  });

  //TI_03
  // Test 2: Sprawdzanie, czy statek można umieścić poprawnie poziomo
  it('should place a ship horizontally when placement is valid', () => {
    // Arrange: Tworzymy szpieg dla zdarzenia `shipPlaced`
    const shipPlacedSpy = spyOn(component.shipPlaced, 'emit');

    // Act: Próba umieszczenia statku na współrzędnych (0,0)
    component.placeShip(0, 0);

    // Assert: Sprawdzanie, czy komórki zostały oznaczone jako część statku
    expect(component.grid[0][0].hasShip).toBeTrue();
    expect(component.grid[0][1].hasShip).toBeTrue();
    expect(component.grid[0][2].hasShip).toBeTrue();

    // Sprawdzanie, czy zdarzenie zostało wyemitowane z oczekiwanymi parametrami
    expect(shipPlacedSpy).toHaveBeenCalledWith(
      jasmine.objectContaining({
        x: 0,
        y: 0,
        size: 3,
        horizontal: true,
      })
    );
  });
  //TI_04
  // Test 3: Sprawdzanie, że statek **nie jest umieszczany**, jeśli dane wejściowe są błędne
  it('should not place a ship if placement is invalid', () => {
    // Arrange: Tworzymy szpieg dla zdarzenia `shipPlaced` oraz symulujemy istniejący statek w polu
    const shipPlacedSpy = spyOn(component.shipPlaced, 'emit');
    component.grid[0][1].hasShip = true; // Symulacja błędnego stanu

    // Act: Próba umieszczenia statku na współrzędnych (0,0)
    component.placeShip(0, 0);

    // Assert: Sprawdzanie, że statek **nie został umieszczony** w błędnym stanie
    expect(component.grid[0][0].hasShip).toBeFalse();
    expect(component.grid[0][1].hasShip).toBeTrue();
    expect(component.grid[0][2].hasShip).toBeFalse();
    expect(shipPlacedSpy).not.toHaveBeenCalled();
  });
  //TI_05
  // Test 4: Sprawdzanie, czy kliknięcie na komórkę w trybie "enemy" powoduje wyemitowanie zdarzenia
  it('should emit onEnemyClicked when clicking on an enemy cell', () => {
    // Arrange: Tworzymy szpieg dla zdarzenia `onEnemyClicked`
    const enemyClickedSpy = spyOn(component.onEnemyClicked, 'emit');
    component.mode = 'enemy';

    // Akt: Symulacja kliknięcia na współrzędną (5,5)
    component.handleClick(5, 5);

    // Assert: Sprawdzanie, czy zdarzenie zostało wyemitowane z oczekiwanymi współrzędnymi
    expect(enemyClickedSpy).toHaveBeenCalledWith(jasmine.objectContaining({ x: 5, y: 5 }));
  });

  //TI_06
  // Test 5: Sprawdzanie, że kliknięcie na komórkę w trybie "enemy" nie powoduje zdarzenia, jeśli nie jest to tura gracza
  it('should not emit onEnemyClicked if it is not the player\'s turn', () => {
    // Arrange: Symulujemy, że tura gracza jest zakończona
    mockGameService.yourTurn = false;
    const enemyClickedSpy = spyOn(component.onEnemyClicked, 'emit');
    component.mode = 'enemy';

    // Act: Symulacja kliknięcia na współrzędną (5,5)
    component.handleClick(5, 5);

    // Assert: Sprawdzanie, czy zdarzenie nie zostało wyemitowane
    expect(enemyClickedSpy).not.toHaveBeenCalled();
  });
  //TI_07
  // Test 6: Sprawdzanie funkcji `getCellClass`, aby zwracała poprawne klasy CSS
  it('should return the correct class for a grid cell', () => {
    let cell = { hasShip: true, shot: true };
    expect(component.getCellClass(cell)).toBe('ship-and-shot');

    cell = { hasShip: true, shot: false };
    expect(component.getCellClass(cell)).toBe('ship');

    cell = { hasShip: false, shot: true };
    expect(component.getCellClass(cell)).toBe('shot');

    cell = { hasShip: false, shot: false };
    expect(component.getCellClass(cell)).toBe('');
  });

  //TI_08
  // Test 7: Sprawdzanie funkcji `clear`, aby upewnić się, że plansza zostaje wyczyszczona
  it('should clear the grid', () => {
    component.grid[0][0].hasShip = true;
    component.grid[0][1].hasShip = true;

    // Act: Wywołanie funkcji clear
    component.clear();

    // Assert: Sprawdzanie, czy plansza została wyczyszczona
    expect(component.grid[0][0].hasShip).toBeFalse();
    expect(component.grid[0][1].hasShip).toBeFalse();
  });
});
