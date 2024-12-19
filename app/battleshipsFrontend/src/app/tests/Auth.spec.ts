import { TestBed } from '@angular/core/testing';
import { AuthService } from '../../app/services/auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';


// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: function (key: string) {
    return this.store[key] || null;
  },
  setItem: function (key: string, value: string) {
    this.store[key] = value;
  },
  removeItem: function (key: string) {
    delete this.store[key];
  },
};

describe('AuthService Unit Tests', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    // Arrange: Konfiguracja środowiska testowego
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useClass: MockRouter },
      ],
    });

    // Pobranie instancji testowanej usługi i konfiguracja
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    // Mockowanie operacji localStorage
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem.bind(mockLocalStorage));
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem.bind(mockLocalStorage));
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem.bind(mockLocalStorage));
  });

  afterEach(() => {
    // Cleanup: Sprawdzanie, czy wszystkie HTTP żądania zostały zakończone
    httpMock.verify();
  });

  // Test 1: Powinno się zalogować i zapisać token w localStorage */
  it('should login and store token in localStorage', () => {
    // Arrange: Przygotowanie danych testowych
    const name = 'John Doe';
    const password = 'pass';
    const fakeResponse = { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' };

    // Act: Wywołanie metody logowania
    service.login(name, password).subscribe(response => {
      // Assert: Sprawdzanie odpowiedzi i zapis tokenu w localStorage
      expect(response).toEqual(fakeResponse);
      expect(localStorage.setItem).toHaveBeenCalledWith('authToken', fakeResponse.token);
    });

    const req = httpMock.expectOne('http://localhost:3001/api/session/create');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name, password });

    req.flush(fakeResponse);
    console.log('should login and store token in localStorage');
  });

  // Test 2: Powinno się wylogować i usunąć token z localStorage oraz przekierować użytkownika na stronę domową */
  it('should logout and clear token and navigate to home', () => {
    // Act: Wywołanie funkcji logout
    service.logout();

    // Assert: Sprawdzanie operacji związanych z wylogowaniem
    expect(localStorage.removeItem).toHaveBeenCalledWith('authToken');
    expect(router.navigate).toHaveBeenCalledWith(['../']);
    console.log('should logout and clear token and navigate to home');
  });

  // Test 3: Dekodowanie prawidłowego tokenu
  it('should decode a valid token', () => {
    // Arrange: Przygotowanie przykładowego tokenu
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    spyOn<any>(service as any, 'decodeToken').and.callThrough();

    // Act: Wywołanie metody dekodującej token
    service['decodeToken'](fakeToken);

    // Assert: Sprawdzanie, czy token został poprawnie zdekodowany
    expect(service['currentUser']).toBeDefined();
    console.log('should decode a valid token');
  });
});
