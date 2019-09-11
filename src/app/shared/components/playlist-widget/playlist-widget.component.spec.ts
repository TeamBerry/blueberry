import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistWidgetComponent } from './playlist-widget.component';

describe('PlaylistItemComponent', () => {
  let component: PlaylistWidgetComponent;
  let fixture: ComponentFixture<PlaylistWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaylistWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
