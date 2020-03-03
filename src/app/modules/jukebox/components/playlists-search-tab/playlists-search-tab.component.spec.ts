import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistsSearchTabComponent } from './playlists-search-tab.component';

describe('FavoriteSearchTabComponent', () => {
  let component: PlaylistsSearchTabComponent;
  let fixture: ComponentFixture<PlaylistsSearchTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistsSearchTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistsSearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
