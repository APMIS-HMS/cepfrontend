import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class LabRequestsComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey ="";

  request_view = false;
  reqDetail_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewRequest: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['', [Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  request_show() {
    this.request_view = !this.request_view;
  }
  reqDetail(){
    this.reqDetail_view = true;
  }
  close_onClick(message: boolean): void {
    this.reqDetail_view = false;
  }
}
