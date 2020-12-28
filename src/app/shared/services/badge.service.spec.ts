/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BadgeService } from './badge.service';

describe('Service: Badge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BadgeService]
    });
  });

  it('should ...', inject([BadgeService], (service: BadgeService) => {
    expect(service).toBeTruthy();
  }));
});
