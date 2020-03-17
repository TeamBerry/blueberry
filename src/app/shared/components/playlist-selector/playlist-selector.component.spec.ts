import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistSelectorComponent } from './playlist-selector.component';

describe('PlaylistSelectorComponent', () => {
  let component: PlaylistSelectorComponent;
  let fixture: ComponentFixture<PlaylistSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
