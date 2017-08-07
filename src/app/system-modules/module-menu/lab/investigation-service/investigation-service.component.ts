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
  pannel_view = false;
  // reqDetail_view = false;
  // personAcc_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  isNumeric = false;

  public frmNewInvestigationh: FormGroup;
  public frmNewPanel: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewInvestigationh = this.formBuilder.group({
      investigationName: ['', [Validators.required]],
      ref: ['', [Validators.required]],
      reportType: ['', [Validators.required]],
      unit: ['', [Validators.required]],
    });

    this.frmNewPanel = this.formBuilder.group({
      panelName: ['', [Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  investigation_show() {
    this.investigation_view = !this.investigation_view;
    this.pannel_view = false;
  }
  pannel_show(){
    this.pannel_view = !this.pannel_view;
    this.investigation_view = false;
  }
  
  close_onClick(message: boolean): void {
  }
}
