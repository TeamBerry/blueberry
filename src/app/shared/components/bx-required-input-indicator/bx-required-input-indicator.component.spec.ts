/* eslint-disable @typescript-eslint/no-unused-vars */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BxRequiredInputIndicatorComponent } from './bx-required-input-indicator.component';

describe('BxRequiredInputIndicatorComponent', () => {
  let component: BxRequiredInputIndicatorComponent;
  let fixture: ComponentFixture<BxRequiredInputIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BxRequiredInputIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BxRequiredInputIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
