import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteSearchTabComponent } from './favorite-search-tab.component';

describe('FavoriteSearchTabComponent', () => {
  let component: FavoriteSearchTabComponent;
  let fixture: ComponentFixture<FavoriteSearchTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteSearchTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteSearchTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
