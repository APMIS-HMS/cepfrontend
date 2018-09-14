import { Component, OnInit, Renderer, ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class LabRequestsComponent implements OnInit {

  apmisLookupUrl = 'patient';
  isValidateForm = false;
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = '';
  apmisLookupImgKey = '';

  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {};
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';
  apmisLookupOtherKeys = [];

  request_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  recievedStatus = true;
  resultStatus = false;
  loading = true;
  extList = false;
  isExternal = false;

  errMsg = 'You have unresolved errors';

  public frmNewRequest: FormGroup;
  searchInvestigation: FormControl;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit() {
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['']
    });
  }

  extList_show() {
    this.extList = true;
  }
  extList_close() {
    this.extList = false;
  }

  onChange() {
    // upload file
  }

  apmisLookupHandleSelectedItem(value) {

  }
  apmisInvestigationLookupHandleSelectedItem(value) {

  }
  request_show() {
    this.request_view = !this.request_view;
  }
  reqDetail(request) {
    this.reqDetail_view = true;
  }
  newPerson() {
    this.personAcc_view = true;
  }
  close_onClick(message: boolean): void {
    this.reqDetail_view = false;
    this.personAcc_view = false;
  }

  save(valid, value) {

  }

  externalChanged($event, investigation) {
  }
}
