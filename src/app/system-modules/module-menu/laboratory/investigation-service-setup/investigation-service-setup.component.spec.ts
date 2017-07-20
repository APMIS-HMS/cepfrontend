import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationServiceSetupComponent } from './investigation-service-setup.component';

describe('InvestigationServiceSetupComponent', () => {
  let component: InvestigationServiceSetupComponent;
  let fixture: ComponentFixture<InvestigationServiceSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationServiceSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationServiceSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
