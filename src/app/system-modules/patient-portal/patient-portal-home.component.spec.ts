import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPortalHomeComponent } from './patient-portal-home.component';

describe('PatientPortalHomeComponent', () => {
  let component: PatientPortalHomeComponent;
  let fixture: ComponentFixture<PatientPortalHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientPortalHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPortalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
