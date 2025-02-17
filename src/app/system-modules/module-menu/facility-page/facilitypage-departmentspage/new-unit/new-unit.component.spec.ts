/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewUnitComponent } from './new-unit.component';

describe('NewUnitComponent', () => {
  let component: NewUnitComponent;
  let fixture: ComponentFixture<NewUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
