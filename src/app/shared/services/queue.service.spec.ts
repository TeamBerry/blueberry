/* eslint-disable @typescript-eslint/no-unused-vars */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueueService } from './queue.service';

describe('Service: Queue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueueService]
    });
  });

  it('should ...', inject([QueueService], (service: QueueService) => {
    expect(service).toBeTruthy();
  }));
});
