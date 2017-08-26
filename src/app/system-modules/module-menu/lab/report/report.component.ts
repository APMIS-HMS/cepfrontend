import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, LaboratoryRequestService, LaboratoryReportService, DocumentationService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, User, PendingLaboratoryRequest } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportFormGroup: FormGroup;
  patientFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  selectedInvestigation: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
  selectedLab: any = {};
  selectedWorkbench: any = {};
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
  pendingReLoading: boolean = true;
  requests: any[] = [];
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
  saveAndUploadBtnText: string = "SAVE AND UPLOAD";
  saveToDraftBtnText: string = "SAVE AS DRAFT";


  constructor(
    private formBuilder: FormBuilder,
    private _locker: CoolSessionStorage,
    private _facilityService: FacilitiesService,
    private _laboratoryRequestService: LaboratoryRequestService,
    private _laboratoryReportService: LaboratoryReportService,
    private _documentationService: DocumentationService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');
    this.selectedLab = <Facility>this._locker.getObject('workbenchCheckingObject');

    this.patientFormGroup = this.formBuilder.group({
      patient: ['', [Validators.required]],
    });

    this.reportFormGroup = this.formBuilder.group({
      result: ['', [Validators.required]],
      outcome: ['', [Validators.required]],
      conclusion: ['', [Validators.required]],
      recommendation: ['', [Validators.required]]
    });

    this.patientFormGroup.controls['patient'].valueChanges.subscribe(value => {
      console.log(value);
      if (value.length > 2) {
        this.apmisLookupQuery = {
          'facilityid': this.facility._id,
          'searchtext': value
        };
      } else {
        this.patientSelected = false;
      }
    });

    this.CheckIfSelectedPatient();
    this._getAllReports();
    this._getAllPendingRequests();
    this.hasRequest = true;
  }

  createReport(valid: boolean, value: any, action: string) {
    if (valid) {
      if (action === 'save') {
        this.saveToDraftBtnText = "SAVING...";
      } else if (action === 'upload') {
        this.saveAndUploadBtnText = "UPLOADING...";
      }
      const isUploaded: boolean = false;
      const isSaved: boolean = false;
      const report = {
        conclusion: value.conclusion,
        outcome: value.outcome,
        recommendation: value.recommendation,
        result: value.result
      };

      // Call the request service and update the investigation.
      this._laboratoryRequestService.find({
        query: {
          'facilityId._id': this.facility._id,
          '_id': this.selectedInvestigation.labRequestId,
        }
      }).then(res => {
        console.log(res);
        // Check the action that the user wants to carry out.
        if (action === 'save') {
          if (res.data.length > 0) {
            res.data[0].investigations.forEach(investigation => {
              if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
                console.log(investigation);
                investigation.report = report;
                investigation.isUploaded = isUploaded;
                investigation.isSaved = isSaved;
              }
            });
            console.log(res);
            this._laboratoryRequestService.update(res.data[0]).then(res => {
              console.log(res);
              this.saveToDraftBtnText = "SAVE AS DRAFT";
              this._notification('Success', 'Report has been saved successfully!');
            }).catch(err => this._notification('Error', 'There was an error saving report. Please try again later!'));
          } else {
            this._notification('Error', 'There was an error saving report. Please try again later!');
          }
        } else if (action === 'upload') {
          if (res.data.length > 0) {
            res.data[0].investigations.forEach(investigation => {
              if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
                console.log(investigation);
                investigation.report = report;
                investigation.isUploaded = !isUploaded;
                investigation.isSaved = !isSaved;

                // Build document to save in documentation
                const document = {
                  documentType: "Clinical Documentation",
                  body: {
                    clinicalInformation: investigation.clinicalInformation,
                    diagnosis: investigation.diagnosis,
                    labNumber: investigation.labNumber,
                    name: investigation.name,
                    report: investigation.report,
                    reportType: investigation.reportType,
                    specimen: investigation.specimen
                  }
                };
              }
            });
            console.log(res.data[0]);

            this._laboratoryRequestService.update(res.data[0]).then(res => {
              if (res) {
                // console.log(res);
                // const docArray = [];
                // //Build documentation model
                // const patientDocumentation = {
                //   document: document,
                //   createdBy: this.employeeDetails,
                //   facilityId: this.facility,
                //   patientId: this.selectedPatient,
                // }

                // docArray.push(patientDocumentation);
                // const documentation = {
                //   personId: this.selectedPatient,
                //   documentations: docArray,
                // };

                // // Save into documentation
                // this._documentationService.create(documentation).then(res => {
                //   console.log(res);
                //   this.saveAndUploadBtnText = "SAVE AND UPLOAD";
                // });
                this._notification('Success', 'Report has been saved successfully!');
              }
            }).catch(err => this._notification('Error', 'There was an error saving report. Please try again later!'));
          } else {
            this._notification('Error', 'There was an error saving report. Please try again later!');
          }
        }
      }).catch(err => this._notification('Error', 'There was an error saving report. Please try again later!'));

    } else {
      this._notification('Error', 'Some fields are empty. Please fill in the required fields!');
    }
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.personDetails.personFullName;
    this.selectedPatient = value;
    this.CheckIfSelectedPatient();
    console.log(value);
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
        'patientId._id': value._id,
      }
    }).then(res => {

    }).catch(err => this._notification('Error', 'There was a problem getting patient details!'));
  }
  showImageBrowseDlg() {

  }
  onChange(e) {

  }
  private _getAllPendingRequests() {
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
        //'lab.id': this.selectedLab.Id, 
        //'workbench.id': this.selectedWorkbench.id 
      }
    }).then(res => {
      console.log(res);
      this.loading = false;
      const labId = this.selectedLab.typeObject.minorLocationId;
      // Filter investigations based on the laboratory Id
      res.data.forEach(labRequest => {
        console.log(labRequest);
        labRequest.investigations.forEach(investigation => {
          console.log(investigation);
          console.log(investigation.isSaved);
          console.log(investigation.isUploaded);
          if (
            (investigation.isSaved === undefined || !investigation.isSaved) ||
            (investigation.isUploaded === undefined || !investigation.isUploaded) &&
            labId === investigation.location.laboratoryId._id
          ) {
            const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
            console.log(investigation);
            if (!investigation.isSaved || !investigation.isUploaded) {
              pendingLabReq.report = investigation.report;
              pendingLabReq.isSaved = investigation.isSaved;
              pendingLabReq.isUploaded = investigation.isUploaded;
            }
            pendingLabReq.labRequestId = labRequest._id;
            pendingLabReq.facility = labRequest.facilityId;
            pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
            pendingLabReq.diagnosis = labRequest.diagnosis;
            pendingLabReq.labNumber = labRequest.labNumber;
            pendingLabReq.patient = labRequest.patientId;
            pendingLabReq.isExternal = investigation.isExternal;
            pendingLabReq.isUrgent = investigation.isUrgent;
            if (investigation.location !== undefined) {
              pendingLabReq.minorLocation = investigation.location.laboratoryId;
            }

            pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
            pendingLabReq.isPanel = investigation.investigation.isPanel;
            pendingLabReq.name = investigation.investigation.name;
            pendingLabReq.reportType = investigation.investigation.reportType;
            pendingLabReq.specimen = investigation.investigation.specimen;
            pendingLabReq.service = investigation.investigation.serviceId;
            pendingLabReq.price = investigation.investigation.unit;
            pendingLabReq.investigationId = investigation.investigation._id;
            pendingLabReq.createdAt = investigation.investigation.createdAt;
            pendingLabReq.updatedAt = investigation.investigation.updatedAt;

            this.pendingRequests.push(pendingLabReq);
          }
        });
      });
      console.log(this.pendingRequests);
    }).catch(err => console.error(err));
  }

  onClickInvestigation(investigation: PendingLaboratoryRequest) {
    console.log(investigation);
    this.selectedPatient = investigation.patient;
    this.selectedInvestigation = investigation;
    this.apmisLookupText = investigation.patient.personDetails.personFullName;
    this.CheckIfSelectedPatient();

    if (investigation.report === undefined) {
      this.reportFormGroup.controls['result'].reset();
      this.reportFormGroup.controls['outcome'].reset();
      this.reportFormGroup.controls['recommendation'].reset();
      this.reportFormGroup.controls['conclusion'].reset();
    } else if (!investigation.isSaved || !investigation.isUploaded) {
      this.reportFormGroup.controls['result'].setValue(this.selectedInvestigation.report.result);
      this.reportFormGroup.controls['outcome'].setValue(this.selectedInvestigation.report.outcome);
      this.reportFormGroup.controls['recommendation'].setValue(this.selectedInvestigation.report.recommendation);
      this.reportFormGroup.controls['conclusion'].setValue(this.selectedInvestigation.report.conclusion);
    }
  }

  private _getAllReports() {
    this._laboratoryReportService.findAll().then(res => {
      console.log(res);
      this.reportLoading = false;
      this.reports = res.data;
    }).catch(err => console.error(err));
  }

  private CheckIfSelectedPatient() {
    if (!!this.selectedPatient && this.selectedPatient.hasOwnProperty('_id')) {
      this.patientSelected = true;
    } else {
      this.patientSelected = false;
    }
  }

  // Notification
  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  numeric_report() {
    this.numericReport = true;
    this.textReport = false;
  }
  text_report() {
    this.numericReport = false;
    this.textReport = true;
  }
  showDoc_toggle() {
    this.docAction = !this.docAction;
  }
  showDiagnosis_toggle() {
    this.diagnosisAction = !this.diagnosisAction;
  }
  close_onClick(message: boolean): void {
    this.repDetail_view = false;
  }
  report_show() {
    this.report_view = !this.report_view;
  }
  repDetail() {
    this.repDetail_view = true;
  }
}
