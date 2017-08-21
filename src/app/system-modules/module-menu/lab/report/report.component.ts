import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationService, LaboratoryRequestService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  selelctedFacility: Facility = <Facility>{};
  apmisLookupUrl = 'patient';
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = 'personDetails.personFullName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';

  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {};
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';
  apmisLookupOtherKeys = ['personDetails.email', 'personDetails.dateOfBirth'];
  selectedPatient: any = <any>{};
  patientSelected: boolean = false;
  loading: boolean = true;
  reportLoading: boolean = true;
  pendingRequests: any[] = [];
  reports: any[] = [];
  hasRequest: boolean = false;

  mainErr = true;
  errMsg = 'You have unresolved errors';

  numericReport = false;
  textReport = true;
  docAction = true;
  diagnosisAction = true;
  report_view = false;
  repDetail_view = false;

  public frmNewReport: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _locker: CoolSessionStorage
  ) {}

  ngOnInit() {
    this.selelctedFacility = <Facility>this._locker.getObject('selectedFacility');

    this.frmNewReport = this.formBuilder.group({
      patient: ['', [Validators.required]],
      result: ['', [Validators.required]],
      outcome: ['', [Validators.required]],
      conclusion: ['', [Validators.required]],
      recomendation: ['', [Validators.required]]
    });

    this.frmNewReport.controls['patient'].valueChanges.subscribe(value => {
      console.log(value);
      if(value.length > 2) {
        this.apmisLookupQuery = {
          'facilityid': this.selelctedFacility._id,
          'searchtext': value
        };
      } else {
        this.patientSelected = false;
      }
    });

    this.CheckIfSelectedPatient();
  }

  createInvestigation(valid: boolean, value: any) {
    console.log(valid);
    console.log(value);
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.personDetails.personFullName;
    this.selectedPatient = value;
    this.CheckIfSelectedPatient();
    console.log(value);
  }

  private CheckIfSelectedPatient() {
    if(!!this.selectedPatient && this.selectedPatient.hasOwnProperty('_id')) {
      this.patientSelected = true;
    } else {
      this.patientSelected = false;
    }
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
    this.repDetail_view = false;
  }
  report_show(){
    this.report_view = !this.report_view;
  }
  repDetail() {
    this.repDetail_view = true;
  }
}
