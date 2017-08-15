import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = '';

  mainErr = true;
  errMsg = 'you have unresolved errors';

  numericReport = true;
  textReport = false;
  docAction = true;
  diagnosisAction = true;

  public frmNewReport: FormGroup;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    this.frmNewReport = this.formBuilder.group({
      patient: ['', [Validators.required]],
      result: ['', [Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value) {

  }
  numeric_report(){
    this.numericReport = true;
    this.textReport = false;
  }
  text_report(){
    this.numericReport = false;
    this.textReport = true;
  }
  showDoc_toggle(){
    this.docAction = !this.docAction;
  }
  showDiagnosis_toggle(){
    this.diagnosisAction = !this.diagnosisAction;
  }
  close_onClick(message: boolean): void {
  }
}
