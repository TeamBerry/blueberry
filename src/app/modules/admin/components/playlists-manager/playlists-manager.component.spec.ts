import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsManagerComponent } from './playlists-manager.component';

describe('PlaylistsManagerComponent', () => {
  let component: PlaylistsManagerComponent;
  let fixture: ComponentFixture<PlaylistsManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
