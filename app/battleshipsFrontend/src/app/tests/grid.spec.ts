import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from '../shared/grid/grid.component';
import { GameService } from '../../app/services/game.service';
import { NgForOf } from '@angular/common';

describe('GridComponent - isValidPlacement', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  class MockGameService {
    yourTurn = true;
  }

  const createEmptyGrid = () => {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ hasShip: false, shot: false }))
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgForOf],
      providers: [{ provide: GameService, useClass: MockGameService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.grid = createEmptyGrid();
  });

  // Test 1: Sprawdzanie, czy funkcja zwraca false, gdy statek wychodzi poza granice siatki poziomo
  it('should return false if the ship placement is out of bounds horizontally', () => {
    // Arrange: Przygotowanie danych testowych do sprawdzenia sytuacji, gdy statek wychodzi poza granice siatki poziomo
    component.currentShipSize = 4;
    component.horizontal = true;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(7, 0);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość false
    expect(result).toBeFalse();


  });

  // Test 2: Sprawdzanie, czy funkcja zwraca false, gdy statek wychodzi poza granice siatki pionowo
  it('should return false if the ship placement is out of bounds vertically', () => {
    // Arrange: Przygotowanie danych testowych do sprawdzenia sytuacji, gdy statek wychodzi poza granice siatki pionowo
    component.currentShipSize = 4;
    component.horizontal = false;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(0, 7);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość false
    expect(result).toBeFalse();

  });

  // Test 3: Sprawdzanie, czy funkcja zwraca false, gdy statek nachodzi na istniejący statek
  it('should return false if the ship placement overlaps with an existing ship', () => {
    // Arrange: Przygotowanie danych testowych, aby statek miał konflikt z istniejącym statkiem
    component.currentShipSize = 3;
    component.horizontal = true;
    component.grid[2][2].hasShip = true;
    component.grid[2][3].hasShip = true;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(2, 2);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość false
    expect(result).toBeFalse();


  });

  // Test 4: Sprawdzanie, czy funkcja zwraca false, gdy statek jest obok innego statku po skosie
  it('should return false if the ship placement is adjacent diagonally', () => {
    // Arrange: Przygotowanie danych testowych dla przypadku, gdy statek umiejscawia się obok innego statku po skosie
    component.currentShipSize = 3;
    component.horizontal = true;
    component.grid[1][3].hasShip = true;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(2, 2);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość false
    expect(result).toBeFalse();


  });

  // Test 5: Sprawdzanie, czy funkcja zwraca true, gdy umiejscowienie statku poziomo jest poprawne
  it('should return true for a valid ship placement horizontally', () => {
    // Arrange: Przygotowanie danych testowych dla poprawnego umiejscowienia statku poziomo
    component.currentShipSize = 3;
    component.horizontal = true;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(0, 0);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość true
    expect(result).toBeTrue();


  });

  // Test 6: Sprawdzanie, czy funkcja zwraca true, gdy umiejscowienie statku pionowo jest poprawne
  it('should return true for a valid ship placement vertically', () => {
    // Arrange: Przygotowanie danych testowych dla poprawnego umiejscowienia statku pionowo
    component.currentShipSize = 3;
    component.horizontal = false;

    // Act: Wywołanie funkcji sprawdzającej poprawność umiejscowienia statku
    const result = component.isValidPlacement(0, 0);

    // Assert: Sprawdzenie, czy funkcja zwraca wartość true
    expect(result).toBeTrue();


  });
});
