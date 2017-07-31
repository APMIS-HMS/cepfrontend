/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimdilizedLookupComponent } from './simdilized-lookup.component';

describe('SimdilizedLookupComponent', () => {
  let component: SimdilizedLookupComponent;
  let fixture: ComponentFixture<SimdilizedLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimdilizedLookupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimdilizedLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
