import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientLaboratoryComponent } from './patient-laboratory.component';

describe('PatientLaboratoryComponent', () => {
  let component: PatientLaboratoryComponent;
  let fixture: ComponentFixture<PatientLaboratoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientLaboratoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientLaboratoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
