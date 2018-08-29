import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rm-new-request',
  templateUrl: './rm-new-request.component.html',
  styleUrls: ['./rm-new-request.component.scss']
})
export class RmNewRequestComponent implements OnInit {

  apmisLookupUrl = 'patient-search';
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = 'firstName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
  apmisLookupOtherKeys = ['lastName', 'firstName', 'apmisId', 'email'];
  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {};
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';

  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  recievedStatus = true;
  resultStatus = false;
  loading = true;
  extList = false;
  isExternal = false;
  isLaboratory = false;
  isValidateForm = false;
  investigationRadio = false;
  requestLoading = false;
  disableBtn = false;
  makeRequestBtn = false;
  errMsg = 'You have unresolved errors';

  investigations: any;
  bindInvestigations: any;

  public frmNewRequest: FormGroup;
  searchInvestigation: FormControl;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router,) { }

  ngOnInit() {
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['']
    });
  }

  save(isvalid, val){}
}
