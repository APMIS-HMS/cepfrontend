import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrtsPg1Component } from './irts-pg1.component';

describe('IrtsPg1Component', () => {
  let component: IrtsPg1Component;
  let fixture: ComponentFixture<IrtsPg1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IrtsPg1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IrtsPg1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
