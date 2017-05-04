import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerryboxNavComponent } from './berrybox-nav.component';

describe('BerryboxNavComponent', () => {
  let component: BerryboxNavComponent;
  let fixture: ComponentFixture<BerryboxNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerryboxNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerryboxNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
