import { TestBed } from '@angular/core/testing';

import { LobbyServiceService } from './lobby-service.service';

describe('LobbyServiceService', () => {
  let service: LobbyServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LobbyServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
