import { RadiologyInvestigationServiceComponent } from '../radiology-investigation-service/radiology-investigation-service.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('RadiologyInvestigationServiceComponent', () => {
  let component: RadiologyInvestigationServiceComponent;
  let fixture: ComponentFixture<RadiologyInvestigationServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyInvestigationServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyInvestigationServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
