import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { wsGuardGuard } from './ws-guard.guard';

describe('wsGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => wsGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
