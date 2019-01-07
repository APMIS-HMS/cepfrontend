import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugSearchComponent } from './drug-search.component';

describe('DrugSearchComponent', () => {
  let component: DrugSearchComponent;
  let fixture: ComponentFixture<DrugSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
