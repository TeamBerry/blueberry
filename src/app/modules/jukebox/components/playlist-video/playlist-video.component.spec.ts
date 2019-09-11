import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistVideoComponent } from './playlist-video.component';

describe('PlaylistItemComponent', () => {
  let component: PlaylistVideoComponent;
  let fixture: ComponentFixture<PlaylistVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
