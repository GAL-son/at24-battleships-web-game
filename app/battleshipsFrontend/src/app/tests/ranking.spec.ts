import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RankingComponent } from '../components/ranking/ranking.component';
import { GetRankingService } from '../services/get-ranking.service';
import { Observable, of } from 'rxjs';

describe('RankingComponent tests', () => {
  let httpMock: HttpTestingController;
  let getRankingService: GetRankingService;
  let component: RankingComponent;

  beforeEach(async () => {
    // Arrange: Konfiguracja środowiska testowego
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RankingComponent],
      providers: [GetRankingService],
    }).compileComponents();

    const fixture = TestBed.createComponent(RankingComponent);
    component = fixture.componentInstance;
    getRankingService = TestBed.inject(GetRankingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Cleanup: Sprawdzanie, czy wszystkie HTTP żądania zostały zakończone
    httpMock.verify();
  });

  //TJ_10
  // Test 1: SPrawdzenie  załadowania danych rankingowych podczas inicjalizacji komponentu
  it('should fetch and populate ranking on init', () => {
    // Arrange: Przygotowanie danych testowych
    const mockData = [
      { name: 'Alice', score: 1200 },
      { name: 'Bob', score: 1000 },
    ];
    spyOn(getRankingService, 'getRanking').and.returnValue(of(mockData));

    // Act: Wywołanie funkcji ngOnInit
    component.ngOnInit();

    // Assert: Sprawdzanie, czy dane zostały załadowane poprawnie
    expect(getRankingService.getRanking).toHaveBeenCalled();
    expect(component.ranking).toEqual(mockData);
  });

  // Test 2: Powinno poprawnie obsłużyć błędy HTTP podczas inicjalizacji
  it('should handle HTTP failures', () => {
    // Arrange: Symulacja błędu HTTP
    spyOn(getRankingService, 'getRanking').and.returnValue(
      new Observable((subscriber) => subscriber.error('Error'))
    );

    // Act: Wywołanie funkcji ngOnInit
    component.ngOnInit();

    // Assert: Sprawdzanie, czy ranking został ustawiony na pustą tablicę
    expect(component.ranking).toEqual([]);
  });
});
