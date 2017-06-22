/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EmployeemanagerDetailpageComponent } from './employeemanager-detailpage.component';

describe('EmployeemanagerDetailpageComponent', () => {
  let component: EmployeemanagerDetailpageComponent;
  let fixture: ComponentFixture<EmployeemanagerDetailpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeemanagerDetailpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeemanagerDetailpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
