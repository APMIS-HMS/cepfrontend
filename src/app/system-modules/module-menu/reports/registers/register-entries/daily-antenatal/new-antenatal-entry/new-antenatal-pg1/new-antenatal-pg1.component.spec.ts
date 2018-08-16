import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAntenatalPg1Component } from './new-antenatal-pg1.component';

describe('NewAntenatalPg1Component', () => {
  let component: NewAntenatalPg1Component;
  let fixture: ComponentFixture<NewAntenatalPg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAntenatalPg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAntenatalPg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
