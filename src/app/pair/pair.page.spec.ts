import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PairPage } from './pair.page';

describe('PairPage', () => {
  let component: PairPage;
  let fixture: ComponentFixture<PairPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PairPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PairPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
