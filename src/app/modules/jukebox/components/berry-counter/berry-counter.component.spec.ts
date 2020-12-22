/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BerryCounterComponent } from './berry-counter.component';

describe('BerryCounterComponent', () => {
  let component: BerryCounterComponent;
  let fixture: ComponentFixture<BerryCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerryCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerryCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
