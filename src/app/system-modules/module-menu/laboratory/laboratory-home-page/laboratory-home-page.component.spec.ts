import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryHomePageComponent } from './laboratory-home-page.component';

describe('LaboratoryHomePageComponent', () => {
  let component: LaboratoryHomePageComponent;
  let fixture: ComponentFixture<LaboratoryHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratoryHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoryHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
