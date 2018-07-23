import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadRequestDetailComponent } from './request-detail.component';

describe('RadRequestDetailComponent', () => {
  let component: RadRequestDetailComponent;
  let fixture: ComponentFixture<RadRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
