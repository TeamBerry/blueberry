import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsTabComponent } from './playlists-tab.component';

describe('PlaylistsTabComponent', () => {
  let component: PlaylistsTabComponent;
  let fixture: ComponentFixture<PlaylistsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
