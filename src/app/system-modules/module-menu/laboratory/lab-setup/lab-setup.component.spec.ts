import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabSetupComponent } from './lab-setup.component';

describe('LabSetupComponent', () => {
  let component: LabSetupComponent;
  let fixture: ComponentFixture<LabSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
