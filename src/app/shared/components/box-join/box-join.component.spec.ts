/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoxJoinComponent } from './box-join.component';

describe('BoxJoinComponent', () => {
  let component: BoxJoinComponent;
  let fixture: ComponentFixture<BoxJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoxJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
