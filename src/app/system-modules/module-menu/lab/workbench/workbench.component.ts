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

  request_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewRequest: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      majorLoc: ['', [Validators.required]],
      minorLoc: ['', [Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  request_show() {
    this.request_view = !this.request_view;
  }
}
