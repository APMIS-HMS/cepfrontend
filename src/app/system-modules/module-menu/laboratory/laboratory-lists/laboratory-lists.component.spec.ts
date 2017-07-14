import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryListsComponent } from './laboratory-lists.component';

describe('LaboratoryListsComponent', () => {
  let component: LaboratoryListsComponent;
  let fixture: ComponentFixture<LaboratoryListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratoryListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoryListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
