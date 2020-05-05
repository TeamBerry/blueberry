import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxesManagerComponent } from './boxes-manager.component';

describe('BoxesManagerComponent', () => {
  let component: BoxesManagerComponent;
  let fixture: ComponentFixture<BoxesManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxesManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxesManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
