/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BxChipComponent } from './bx-chip.component';

describe('BxChipComponent', () => {
  let component: BxChipComponent;
  let fixture: ComponentFixture<BxChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BxChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BxChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
