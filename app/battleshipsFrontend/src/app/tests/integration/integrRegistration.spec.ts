import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RegisterComponent } from '../../components/register/register.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('RegisterComponent Integration Tests', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(async () => {
    // Arrange: Konfiguracja środowiska testowego z wymaganymi modułami i providerami
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterModule,
        RegisterComponent,
      ],
      providers: [
        AuthService,
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  afterEach(() => {
    // Cleanup: Sprawdzanie, czy wszystkie HTTP żądania zostały zakończone
    httpMock.verify();
  });

  // Test 1: Rejestracja zakończona sukcesem i nawigacja do strony logowania
  it('should successfully register and navigate to login', () => {
    // Arrange: Konfiguracja spy na metodę rejestracji i dane testowe
    // @ts-ignore
    spyOn(authService, 'register').and.returnValue(of({ success: true }));
    component.username = 'testuser';
    component.email = 'testuser@mail.com';
    component.password = 'Test1234';

    // Act: Wywołanie funkcji rejestracji
    component.Register({ preventDefault: () => {} } as Event);

    // Assert: Sprawdzanie, czy metoda została wywołana z odpowiednimi parametrami
    expect(authService.register).toHaveBeenCalledWith(
      'testuser',
      'testuser@mail.com',
      'Test1234'
    );

    // Assert: Sprawdzanie, czy użytkownik został przekierowany do strony logowania
    expect(router.navigate).toHaveBeenCalledWith(['../login']);
  });

  // Test 2: Obsługa błędu 400 (nazwa użytkownika już istnieje)
  it('should handle 400 error by showing an appropriate error message', () => {
    // Arrange: Symulacja błędu 400 z serwisu authService
    spyOn(authService, 'register').and.returnValue(
      throwError(() => ({
        status: 400,
        message: 'Username already taken',
      }))
    );

    component.username = 'testuser';
    component.email = 'testuser@mail.com';
    component.password = 'Test1234';

    // Act: Wywołanie funkcji rejestracji
    component.Register({ preventDefault: () => {} } as Event);

    // Assert: Sprawdzanie, czy metoda została wywołana z odpowiednimi parametrami
    expect(authService.register).toHaveBeenCalledWith(
      'testuser',
      'testuser@mail.com',
      'Test1234'
    );

    // Assert: Sprawdzanie, czy komunikat błędu został poprawnie ustawiony
    expect(component.errorMessage).toBe(
      'Username already taken. Please choose a different one.'
    );
  });

  // Test 3: Obsługa nieoczekiwanych błędów
  it('should handle unexpected errors by showing a generic error message', () => {
    // Arrange: Symulacja błędu 500 z serwisu authService
    spyOn(authService, 'register').and.returnValue(
      throwError(() => ({
        status: 500,
        message: 'Internal server error',
      }))
    );

    component.username = 'testuser';
    component.email = 'testuser@mail.com';
    component.password = 'Test1234';

    // Act: Wywołanie funkcji rejestracji
    component.Register({ preventDefault: () => {} } as Event);

    // Assert: Sprawdzanie, czy metoda została wywołana z odpowiednimi parametrami
    expect(authService.register).toHaveBeenCalledWith(
      'testuser',
      'testuser@mail.com',
      'Test1234'
    );

    // Assert: Sprawdzanie, czy komunikat błędu został poprawnie ustawiony
    expect(component.errorMessage).toBe(
      'An unexpected error occurred. Please try again later.'
    );
  });
});
