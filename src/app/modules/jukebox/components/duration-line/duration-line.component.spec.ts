/* eslint-disable @typescript-eslint/no-unused-vars */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DurationLineComponent } from './duration-line.component';

describe('DurationLineComponent', () => {
  let component: DurationLineComponent;
  let fixture: ComponentFixture<DurationLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DurationLineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DurationLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
