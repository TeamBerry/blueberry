/* eslint-disable @typescript-eslint/no-unused-vars */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AclFormComponent } from './acl-form.component';

describe('AclFormComponent', () => {
  let component: AclFormComponent;
  let fixture: ComponentFixture<AclFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AclFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AclFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
