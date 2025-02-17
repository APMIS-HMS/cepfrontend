import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FluidComponent } from './fluid.component';

describe('FluidComponent', () => {
  let component: FluidComponent;
  let fixture: ComponentFixture<FluidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FluidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FluidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
