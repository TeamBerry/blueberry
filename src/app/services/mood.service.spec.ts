import { TestBed, inject } from '@angular/core/testing';

import { MoodService } from './mood.service';

describe('MoodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MoodService]
    });
  });

  it('should ...', inject([MoodService], (service: MoodService) => {
    expect(service).toBeTruthy();
  }));
});
