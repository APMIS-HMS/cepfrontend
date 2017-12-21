import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpHomeComponent } from './pp-home.component';

describe('PpHomeComponent', () => {
  let component: PpHomeComponent;
  let fixture: ComponentFixture<PpHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
