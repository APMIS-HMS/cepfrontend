import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IkeComponent } from './ike.component';

describe('IkeComponent', () => {
  let component: IkeComponent;
  let fixture: ComponentFixture<IkeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IkeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IkeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
