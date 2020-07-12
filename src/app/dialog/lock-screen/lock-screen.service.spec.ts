import { TestBed } from '@angular/core/testing';

import { LockScreenService } from './lock-screen.service';

describe('LockScreenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LockScreenService = TestBed.get(LockScreenService);
    expect(service).toBeTruthy();
  });
});
