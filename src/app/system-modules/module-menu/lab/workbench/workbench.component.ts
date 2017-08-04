import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey ="";

  workbench_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewWorkbench: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewWorkbench = this.formBuilder.group({
      minorLocations: ['', [Validators.required]],
      benchName: ['', [Validators.required]],
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  workbench_show() {
    this.workbench_view = !this.workbench_view;
  }
  reqDetail(){
    this.reqDetail_view = true;
  }
  newPerson(){
    this.personAcc_view = true;
  }
  close_onClick(message: boolean): void {
    this.reqDetail_view = false;
    this.personAcc_view = false;
  }
}
