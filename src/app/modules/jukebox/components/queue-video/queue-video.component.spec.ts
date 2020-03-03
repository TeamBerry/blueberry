import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueVideoComponent } from './queue-video.component';

describe('PlaylistItemComponent', () => {
  let component: QueueVideoComponent;
  let fixture: ComponentFixture<QueueVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
