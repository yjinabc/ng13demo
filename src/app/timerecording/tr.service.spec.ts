import { TestBed } from '@angular/core/testing';

import { TrService } from './tr.service';

describe('TrService', () => {
  let service: TrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
