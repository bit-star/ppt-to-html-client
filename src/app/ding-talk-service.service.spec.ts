import { TestBed, inject } from '@angular/core/testing';

import { DingTalkServiceService } from './ding-talk-service.service';

describe('DingTalkServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DingTalkServiceService]
    });
  });

  it('should be created', inject([DingTalkServiceService], (service: DingTalkServiceService) => {
    expect(service).toBeTruthy();
  }));
});
