import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from '../../components/login/login.component';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

// Mock Router: Tworzymy klasę, która symuluje Router
class MockRouter {
  navigate = jasmine.createSpy('navigate'); // Szpieg na metodę nawigacji
}

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: MockRouter;

  beforeEach(async () => {
    // Arrange: Konfiguracja środowiska testowego
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Mockowanie HTTP requestów
        RouterModule, // Importowanie routera
        LoginComponent, // Importujemy LoginComponent jako standalone
      ],
      providers: [
        AuthService, // Dostarczamy AuthService
        { provide: Router, useClass: MockRouter }, // Podmieniamy Router na nasz mock
      ],
    }).compileComponents();

    // Tworzenie instancji komponentu
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    // Pobranie zależności
    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as unknown as MockRouter;
  });

  afterEach(() => {
    // Cleanup: Sprawdzanie, czy wszystkie oczekiwane HTTP requesty zostały zakończone
    httpMock.verify();
  });
//TI_02
  // Test 1: Sprawdzenie poprawnego logowania i nawigacji po zalogowaniu
  it('should login successfully and navigate to home after clicking Login', () => {
    // Arrange: Konfiguracja mock authService.login do zwracania sukcesu
    spyOn(authService, 'login').and.returnValue(of({ token: 'fake-token' }));

    // Przygotowanie danych użytkownika do logowania
    component.name = 'user';
    component.password = 'password';

    // Act: Symulacja kliknięcia przycisku logowania
    component.Login({ preventDefault: () => {} } as Event);

    // Assert: Sprawdzanie, czy funkcja login została wywołana z odpowiednimi danymi
    expect(authService.login).toHaveBeenCalledWith('user', 'password');
    // Sprawdzanie, czy użytkownik został przekierowany do strony domowej
    expect(router.navigate).toHaveBeenCalledWith(['../home']);
  });

  //TI_01
  // Test 2: Sprawdzenie, czy logowanie poprawnie obsługuje błąd
  it('should log an error if login fails', () => {
    // Arrange: Konfiguracja mock authService.login do zwracania błędu
    spyOn(authService, 'login').and.returnValue(throwError(() => new Error('Login failed')));

    // Przygotowanie danych użytkownika do logowania
    component.name = 'user';
    component.password = 'password';

    // Dodanie szpiega na console.error, aby sprawdzić, czy logowanie błędów działa poprawnie
    spyOn(console, 'error');

    // Act: Symulacja kliknięcia przycisku logowania
    component.Login({ preventDefault: () => {} } as Event);

    // Assert: Sprawdzanie, czy funkcja login została wywołana z odpowiednimi danymi
    expect(authService.login).toHaveBeenCalledWith('user', 'password');
    // Sprawdzanie, czy funkcja console.error została wywołana po napotkaniu błędu
    expect(console.error).toHaveBeenCalled();
  });
});
