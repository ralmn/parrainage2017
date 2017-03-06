import { TestBed, inject } from '@angular/core/testing';

import { SenateurService } from './senateur.service';

describe('SenateurService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SenateurService]
    });
  });

  it('should ...', inject([SenateurService], (service: SenateurService) => {
    expect(service).toBeTruthy();
  }));
});
