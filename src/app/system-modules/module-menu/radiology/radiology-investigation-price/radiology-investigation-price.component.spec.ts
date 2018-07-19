import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyInvestigationPriceComponent } from './radiology-investigation-price.component';

describe('RadiologyInvestigationPriceComponent', () => {
  let component: RadiologyInvestigationPriceComponent;
  let fixture: ComponentFixture<RadiologyInvestigationPriceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadiologyInvestigationPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadiologyInvestigationPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
