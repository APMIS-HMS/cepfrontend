import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigationSetupComponent } from './investigation-setup.component';

describe('InvestigationSetupComponent', () => {
  let component: InvestigationSetupComponent;
  let fixture: ComponentFixture<InvestigationSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvestigationSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvestigationSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
