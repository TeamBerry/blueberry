import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BxAlertComponent } from './bx-alert.component';

describe('BxAlertComponent', () => {
  let component: BxAlertComponent;
  let fixture: ComponentFixture<BxAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BxAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BxAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
