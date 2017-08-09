import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey = "";

  selectedFacility: Facility = <Facility>{};

  workbench_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewWorkbench: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewWorkbench = this.formBuilder.group({
      minorLocations: ['', [Validators.required]],
      benchName: ['', [Validators.required]]
    })
  }

  apmisLookupHandleSelectedItem(value) {

  }
  workbench_show() {
    this.workbench_view = !this.workbench_view;
  }

  close_onClick(message: boolean): void {

  }
}
