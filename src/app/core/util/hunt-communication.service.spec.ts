import { TestBed } from '@angular/core/testing';

import { HuntCommunicationService } from './hunt-communication.service';

describe('HuntCommunicationService', () => {
  let service: HuntCommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HuntCommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
