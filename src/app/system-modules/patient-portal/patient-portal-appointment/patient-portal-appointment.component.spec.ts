import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPortalAppointmentComponent } from './patient-portal-appointment.component';

describe('PatientPortalAppointmentComponent', () => {
  let component: PatientPortalAppointmentComponent;
  let fixture: ComponentFixture<PatientPortalAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPortalAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPortalAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
