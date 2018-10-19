import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmunizationSummaryComponent } from './immunization-summary.component';

describe('ImmunizationSummaryComponent', () => {
  let component: ImmunizationSummaryComponent;
  let fixture: ComponentFixture<ImmunizationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmunizationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmunizationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
