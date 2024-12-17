import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridComponent } from '../shared/grid/grid.component';
import { GameService } from '../../app/services/game.service';
import { NgForOf } from '@angular/common';

describe('GridComponent - isValidPlacement', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  // Mock GameService
  class MockGameService {
    yourTurn = true;
  }

  // Utility to create a 10x10 grid
  const createEmptyGrid = () => {
    return Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () => ({ hasShip: false, shot: false }))
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridComponent, NgForOf], // Import the standalone component here
      providers: [{ provide: GameService, useClass: MockGameService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    component.grid = createEmptyGrid();
  });

  it('should return false if the ship placement is out of bounds horizontally', () => {
    component.currentShipSize = 4;
    component.horizontal = true;

    const result = component.isValidPlacement(7, 0); // Ship overflows beyond column 9
    expect(result).toBeFalse();
  });

  it('should return false if the ship placement is out of bounds vertically', () => {
    component.currentShipSize = 4;
    component.horizontal = false;

    const result = component.isValidPlacement(0, 7); // Ship overflows beyond row 9
    expect(result).toBeFalse();
  });

  it('should return false if the ship placement overlaps with an existing ship', () => {
    component.currentShipSize = 3;
    component.horizontal = true;

    // Place a ship at (2, 2) horizontally
    component.grid[2][2].hasShip = true;
    component.grid[2][3].hasShip = true;

    const result = component.isValidPlacement(2, 2); // Overlaps with the existing ship
    expect(result).toBeFalse();
  });

  it('should return false if the ship placement is adjacent diagonally', () => {
    component.currentShipSize = 3;
    component.horizontal = true;

    // Place a ship diagonally close at (2, 2)
    component.grid[1][3].hasShip = true;

    const result = component.isValidPlacement(2, 2); // Should fail due to diagonal adjacency
    expect(result).toBeFalse();
  });

  it('should return true for a valid ship placement horizontally', () => {
    component.currentShipSize = 3;
    component.horizontal = true;

    const result = component.isValidPlacement(0, 0);
    expect(result).toBeTrue();
  });

  it('should return true for a valid ship placement vertically', () => {
    component.currentShipSize = 3;
    component.horizontal = false;

    const result = component.isValidPlacement(0, 0);
    expect(result).toBeTrue();
  });
});
