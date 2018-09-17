import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FprPg2Component } from './fpr-pg2.component';

describe('FprPg2Component', () => {
  let component: FprPg2Component;
  let fixture: ComponentFixture<FprPg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FprPg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FprPg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
