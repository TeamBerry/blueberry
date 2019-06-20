import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesTabComponent } from './boxes-tab.component';

describe('BoxesTabComponent', () => {
  let component: BoxesTabComponent;
  let fixture: ComponentFixture<BoxesTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
