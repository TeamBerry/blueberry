import { TestBed, inject } from '@angular/core/testing';

import { JukeboxService } from './jukebox.service';

describe('JukeboxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JukeboxService]
    });
  });

  it('should ...', inject([JukeboxService], (service: JukeboxService) => {
    expect(service).toBeTruthy();
  }));
});
