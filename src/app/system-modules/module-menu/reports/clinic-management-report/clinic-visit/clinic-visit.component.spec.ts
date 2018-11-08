import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicVisitComponent } from './clinic-visit.component';

describe('ClinicVisitComponent', () => {
  let component: ClinicVisitComponent;
  let fixture: ComponentFixture<ClinicVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
