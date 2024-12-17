import { TestBed } from '@angular/core/testing';
import { WebSocketService } from '../../app/services/websocket/web-socket.service';
import { GameService } from '../services/game.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

// Mocks
class MockGameService {
  emitHitYou = jasmine.createSpy('emitHitYou');
  emitEnemyHit = jasmine.createSpy('emitEnemyHit');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// @ts-ignore
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: jasmine.createSpy('getItem').and.callFake((key: string) => {
    return mockLocalStorage.store[key] || null;
  }),
  setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: jasmine.createSpy('clear').and.callFake(() => {
    mockLocalStorage.store = {};
  }),
};

describe('WebSocketService unit test', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      teardown: { destroyAfterEach: false },
      providers: [
        WebSocketService,
        { provide: GameService, useClass: MockGameService },
        { provide: Router, useClass: MockRouter },
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: { localStorage: mockLocalStorage },
          },
        },
      ],
    });

    service = TestBed.inject(WebSocketService);
    mockLocalStorage.store = {}; // Reset mock localStorage before each test
  });

  // Test for shotMessage()
  it('should return a formatted shot message', () => {
    const testKey = 'test-session-key';
    mockLocalStorage.setItem('WStoken', testKey);

    const x = 5;
    const y = 8;

    const expectedMessage = JSON.stringify({
      sessionKey: testKey,
      message: 'move',
      move: {
        moveCoordinates: { x, y },
      },
    });

    const result = service.shotMessage(x, y);

    expect(result).toEqual(expectedMessage);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('WStoken');
  });

  // Test for hasKey()
  describe('hasKey()', () => {
    it('should return true when WebSocket key exists', () => {
      // Arrange
      const testKey = 'existing-key';
      mockLocalStorage.setItem('WStoken', testKey);

      // Act
      const result = (service as any).hasKey();

      // Assert
      expect(result).toBeTrue();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('WStoken');
    });

    it('should return false when WebSocket key does not exist', () => {
      // Arrange
      mockLocalStorage.removeItem('WStoken');

      // Act
      const result = (service as any).hasKey();

      // Assert
      expect(result).toBeFalse();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('WStoken');
    });
  });
  describe('storeData()', () => {
    it('should correctly parse and store game setup and enemy data', () => {
      // Arrange
      const message = {
        opponent: { name: 'EnemyPlayer', score: '1000' },
        gameSetup: { shipSizes: { '2': 3, '3': 2 } },
      };

      // Act
      service.storeData(message);

      // Assert
      expect(service.enemy.name).toBe('EnemyPlayer');
      expect(service.enemy.score).toBe('1000');
      expect(service.setup).toEqual([2, 2, 2, 3, 3]); // Flattened array of ship sizes
    });
  });
});
