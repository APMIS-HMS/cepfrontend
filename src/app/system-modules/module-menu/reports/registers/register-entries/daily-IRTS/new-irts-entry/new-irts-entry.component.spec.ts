import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIrtsEntryComponent } from './new-irts-entry.component';

describe('NewIrtsEntryComponent', () => {
  let component: NewIrtsEntryComponent;
  let fixture: ComponentFixture<NewIrtsEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIrtsEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIrtsEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
