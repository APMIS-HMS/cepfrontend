import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkbenchSetupComponent } from './workbench-setup.component';

describe('WorkbenchSetupComponent', () => {
  let component: WorkbenchSetupComponent;
  let fixture: ComponentFixture<WorkbenchSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkbenchSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkbenchSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
