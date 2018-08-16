import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAntenatalPg2Component } from './new-antenatal-pg2.component';

describe('NewAntenatalPg2Component', () => {
  let component: NewAntenatalPg2Component;
  let fixture: ComponentFixture<NewAntenatalPg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAntenatalPg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAntenatalPg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
