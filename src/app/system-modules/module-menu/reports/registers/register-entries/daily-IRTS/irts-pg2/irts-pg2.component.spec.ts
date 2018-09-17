import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrtsPg2Component } from './irts-pg2.component';

describe('IrtsPg2Component', () => {
  let component: IrtsPg2Component;
  let fixture: ComponentFixture<IrtsPg2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrtsPg2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrtsPg2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
