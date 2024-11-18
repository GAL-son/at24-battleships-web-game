import { TestBed } from '@angular/core/testing';

import { GetRankingService } from './get-ranking.service';

describe('GetRankingService', () => {
  let service: GetRankingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetRankingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
