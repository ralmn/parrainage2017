import { TestBed, inject } from '@angular/core/testing';

import { CandidatService } from './candidat.service';

describe('CandidatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CandidatService]
    });
  });

  it('should ...', inject([CandidatService], (service: CandidatService) => {
    expect(service).toBeTruthy();
  }));
});
