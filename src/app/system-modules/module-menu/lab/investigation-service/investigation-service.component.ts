import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-investigation-service',
  templateUrl: './investigation-service.component.html',
  styleUrls: ['./investigation-service.component.scss']
})
export class InvestigationServiceComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey ="";

  investigation_view = false;
  // reqDetail_view = false;
  // personAcc_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewInvestigationh: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewInvestigationh = this.formBuilder.group({
      investigationName: ['', [Validators.required]],
      ref: ['', [Validators.required]],
      reportType: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  investigation_show() {
    this.investigation_view = !this.investigation_view;
  }
  
  close_onClick(message: boolean): void {
  }
}
