import { TestBed } from '@angular/core/testing';

import { PlaylistService } from './playlist.service';

describe('PlaylistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlaylistService = TestBed.inject(PlaylistService);
    expect(service).toBeTruthy();
  });
});
