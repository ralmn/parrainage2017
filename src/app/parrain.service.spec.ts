import { TestBed, inject } from '@angular/core/testing';

import { ParrainService } from './parrain.service';

describe('ParrainService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParrainService]
    });
  });

  it('should ...', inject([ParrainService], (service: ParrainService) => {
    expect(service).toBeTruthy();
  }));
});
