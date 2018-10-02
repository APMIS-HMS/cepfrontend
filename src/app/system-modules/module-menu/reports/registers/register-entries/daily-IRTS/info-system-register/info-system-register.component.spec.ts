import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSystemRegisterComponent } from './info-system-register.component';

describe('InfoSystemRegisterComponent', () => {
  let component: InfoSystemRegisterComponent;
  let fixture: ComponentFixture<InfoSystemRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSystemRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSystemRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
