import { TestBed } from '@angular/core/testing';

import { TherapistsService } from './therapists.service';

describe('TherapistsService', () => {
  let service: TherapistsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TherapistsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
