/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BerryCostComponent } from './berry-cost.component';

describe('BerryCostComponent', () => {
  let component: BerryCostComponent;
  let fixture: ComponentFixture<BerryCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerryCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerryCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
