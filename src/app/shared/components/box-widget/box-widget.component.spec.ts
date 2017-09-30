import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxWidgetComponent } from './box-widget.component';

describe('BoxWidgetComponent', () => {
  let component: BoxWidgetComponent;
  let fixture: ComponentFixture<BoxWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
