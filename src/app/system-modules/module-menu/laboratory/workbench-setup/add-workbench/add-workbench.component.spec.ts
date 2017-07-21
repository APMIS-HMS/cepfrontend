import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkbenchComponent } from './add-workbench.component';

describe('AddWorkbenchComponent', () => {
  let component: AddWorkbenchComponent;
  let fixture: ComponentFixture<AddWorkbenchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkbenchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkbenchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
