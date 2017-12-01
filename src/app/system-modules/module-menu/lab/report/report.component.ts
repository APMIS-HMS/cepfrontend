import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FacilitiesService, LaboratoryRequestService,
  LaboratoryReportService, DocumentationService, FormsService, BillingService
} from '../../../../services/facility-manager/setup/index';
import { Facility, User, PendingLaboratoryRequest } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  @Output() selectedInvestigationData: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
  reportFormGroup: FormGroup;
  patientFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};
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
  apmisLookupOtherKeys = ['personDetails.email', 'personDetails.dateOfBirth'];
  selectedPatient: any = <any>{};
  patientSelected: Boolean = false;
  loading: Boolean = true;
  reportLoading: Boolean = true;
  pendingReLoading: Boolean = true;
  requests: any[] = [];
  pendingRequests: any[] = [];
  reports: any[] = [];
  hasRequest: Boolean = false;
  mainErr = true;
  errMsg = 'You have unresolved errors';
  numericReport = false;
  textReport = true;
  docAction = true;
  diagnosisAction = true;
  report_view = false;
  repDetail_view = false;
  activeInvestigationNo: number = -1;
  referenceValue: String = '';
  saveAndUploadBtnText: String = 'SAVE AND UPLOAD';
  saveToDraftBtnText: String = 'SAVE AS DRAFT';
  disablePaymentBtn: Boolean = false;
  importTemplate: Boolean = false;
	paymentStatusText: String = '<i class="fa fa-refresh"></i> Refresh Payment Status';

  constructor(
    private formBuilder: FormBuilder,
    private _router: ActivatedRoute,
    private _route: Router,
    private _locker: CoolLocalStorage,
    public facilityService: FacilitiesService,
    private _formService: FormsService,
    private _laboratoryRequestService: LaboratoryRequestService,
    private _documentationService: DocumentationService,
    private _billingService: BillingService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');
    this.selectedLab = <any>this._locker.getObject('workbenchCheckingObject');

    this.patientFormGroup = this.formBuilder.group({
      patient: ['', [Validators.required]],
    });

    this.reportFormGroup = this.formBuilder.group({
      result: ['', [Validators.required]],
      outcome: ['', [Validators.required]],
      conclusion: [''],
      recommendation: ['']
    });

    this.patientFormGroup.controls['patient'].valueChanges.subscribe(value => {
      if (value.length > 2) {
        this.apmisLookupQuery = {
          'facilityid': this.facility._id,
          'searchtext': value
        };
      } else {
        this.activeInvestigationNo = -1;
        this.patientSelected = false;
      }
    });

    this.reportFormGroup.controls['result'].valueChanges.subscribe(val => {
      if (this.numericReport) {
        if (this.selectedInvestigation.reportType.name.toLowerCase() === 'numeric'.toLowerCase()) {
          if (this.selectedInvestigation.reportType.ref.min > val) {
            this.referenceValue = 'Low';
          } else if (this.selectedInvestigation.reportType.ref.min < val && this.selectedInvestigation.reportType.ref.max > val) {
            this.referenceValue = 'Normal';
          } else if (this.selectedInvestigation.reportType.ref.max < val) {
            this.referenceValue = 'High';
          }
        }
      }
    });

    this._getAllReports();
    this._getDocumentationForm();

    this._router.params.subscribe(url => {
      console.log(url);
      if (!!url.requestId) {
        this.report_show();
        this._getSelectedPendingRequests(url.requestId, url.investigationId);
      } else {
        this.CheckIfSelectedPatient();
        this._getAllPendingRequests();
        this.hasRequest = true;
      }
    });
  }

  createReport(valid: Boolean, value: any, action: String) {
    if (valid) {
      if (action === 'save') {
        this.saveToDraftBtnText = 'SAVING...';
      } else if (action === 'upload') {
        this.saveAndUploadBtnText = 'UPLOADING...';
      }
      const isUploaded: Boolean = false;
      const isSaved: Boolean = false;
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
            const labRequest = res.data[0];

            labRequest.investigations.forEach(investigation => {
              if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
                investigation.report = report;
                investigation.isUploaded = isUploaded;
                investigation.isSaved = !isSaved;
              }
            });

            this._laboratoryRequestService.update(labRequest).then(res => {
              console.log(res);
              this._getAllReports();
              this.saveToDraftBtnText = 'SAVE AS DRAFT';
              this._notification('Success', 'Report has been saved successfully!');
            }).catch(err => this._notification('Error', 'There was an error saving report. Please try again later!'));
          } else {
            this._notification('Error', 'There was an error saving report. Please try again later!');
          }
        } else if (action === 'upload') {
          if (res.data.length > 0) {
            const labRequest = res.data[0];
            const saveDocument = {
              documentType: this.selectedForm,
              body: {}
            };

            labRequest.investigations.forEach(investigation => {
              if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
                investigation.report = report;
                investigation.isUploaded = !isUploaded;
                investigation.isSaved = !isSaved;

                // Build document to save in documentation
                saveDocument.body = {
                  'Conclusion': investigation.report.conclusion,
                  'Recommendation': investigation.report.outcome,
                  'Outcome': investigation.report.outcome,
                  'Result': investigation.report.result,
                  'Specimen': investigation.investigation.specimen.name,
                  'Diagnosis': labRequest.diagnosis,
                  'Clinical Information': labRequest.clinicalInformation,
                  'Laboratory Number': labRequest.labNumber,
                  'Test Name': investigation.investigation.name
                }
              }
            });

            this._laboratoryRequestService.update(labRequest).then(res => {
              if (res) {
                console.log(res);
                // Delete irrelevant data from employee
                delete this.employeeDetails.employeeDetails.countryItem;
                delete this.employeeDetails.employeeDetails.nationalityObject;
                delete this.employeeDetails.employeeDetails.nationality;

                // Build documentation model
                const patientDocumentation = {
                  document: saveDocument,
                  createdBy: this.employeeDetails.employeeDetails,
                  facilityId: this.miniFacility,
                  patientId: this.selectedPatient,
                };

                const documentation = {
                  personId: this.selectedPatient.personDetails,
                  documentations: patientDocumentation,
                };

                // Check if documentation has been created for the user
                this._documentationService.find({
                  query: {
                    'personId._id': this.selectedPatient.personDetails._id
                  }
                }).then(res => {
                  console.log(res);
                  // Update the lists
                  this._getAllReports();
                  // Updated this.pendingRequests
                  this._getAllPendingRequests();
                  this.patientSelected = false;

                  if (res.data.length > 0) {
                    res.data[0].documentations.push(patientDocumentation);
                    // Update the existing documentation
                    this._documentationService.update(res.data[0]).then(res => {
                      this.saveAndUploadBtnText = 'SAVE AND UPLOAD';
                      this._notification('Success', 'Report has been saved successfully!');
                    });
                  } else {
                    // Save into documentation
                    this._documentationService.create(documentation).then(res => {
                      this.saveAndUploadBtnText = 'SAVE AND UPLOAD';
                      this._notification('Success', 'Report has been saved and uploaded successfully!');
                    });
                  }
                });
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
    this.pendingReLoading = true;
    this.apmisLookupText = value.personDetails.personFullName;
    this.selectedPatient = value;
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
        'patientId._id': value._id,
      }
    }).then(res => {
      this.pendingReLoading = false;
      if (res.data.length > 0) {
        const pendingRequests = this._modelPendingRequests(res.data);
        if (pendingRequests.length > 0) {
          this.pendingRequests = pendingRequests.filter(x => (x.isSaved === undefined || x.isSaved) && (x.isUploaded === undefined || (x.isUploaded === false)));

          // If pendingRequests contains at least a value, then get payment status
          if (this.pendingRequests.length > 0) {
            setTimeout(e => {
              this._getPaymentStatus();
            }, 500);
          }
        } else {
          this.pendingRequests = [];
        }
      } else {
        this.pendingRequests = [];
      }
    }).catch(err => this._notification('Error', 'There was a problem getting patient details!'));
  }

  showImageBrowseDlg() {
    // this.selectImage();
  }

  selectImage(fileInput: any) {
    console.log(event);
    const fileList = fileInput.target.files;
    console.log(fileList);
    if (fileList.length > 0) {
        const file: File = fileList[0];
        const formData: FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        const headers = new Headers();
        /** No need to include Content-Type in Angular 4 */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        // let options = new RequestOptions({ headers: headers });

        // this.http.post(`${this.apiEndPoint}`, formData, options)
        //     .map(res => res.json())
        //     .catch(error => Observable.throw(error))
        //     .subscribe(
        //         data => console.log('success'),
        //         error => console.log(error)
        //     )
    }
  }

  onChange(e) {

  }

  private _getSelectedPendingRequests(requestId, investigationId) {
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
        '_id': requestId,
      }
    }).then(res => {
      this.pendingReLoading = false;
      if (res.data.length > 0) {
        this.pendingReLoading = true;
        this.hasRequest = true;
        const pendingRequests = this._modelPendingRequests(res.data);
        if (pendingRequests.length > 0) {
          this.pendingRequests = pendingRequests.filter(x => (x.isSaved === undefined || x.isSaved) && (x.isUploaded === undefined || (x.isUploaded === false)));

          // Highlight the investigation that was selected fro the route parameters
          this.pendingRequests.forEach((invesigation, i) => {
            if (invesigation.investigationId === investigationId) {
              this.onClickInvestigation(invesigation, i);
            }
          });

          // If pendingRequests contains at least a value, then get payment status
          if (this.pendingRequests.length > 0) {
            setTimeout(e => {
              this._getPaymentStatus();
            }, 500);
          }
        } else {
          this.pendingRequests = [];
        }
      } else {
        const text = 'This page with id ' + investigationId + ' Does not have any pending request. Redirecting...';
        this._notification('Error', text);
        setTimeout(e => {
          this._route.navigate(['/dashboard/laboratory/reports']);
        }, 2000);
      }
    }).catch(err => {
      const text = 'This page with id ' + investigationId + ' Does not exist. Redirecting...';
      this._notification('Error', text);
      setTimeout(e => {
        this._route.navigate(['/dashboard/laboratory/reports']);
      }, 2000);
    });
  }

  private _getAllPendingRequests() {
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
      }
    }).then(res => {
      console.log(res);
      this.pendingReLoading = false;
      if (res.data.length > 0) {
        const pendingRequests = this._modelPendingRequests(res.data);
        if (pendingRequests.length > 0) {
          this.pendingRequests = pendingRequests.filter(x => (x.isSaved === undefined || x.isSaved) && (x.isUploaded === undefined || (x.isUploaded === false)));

          // If pendingRequests contains at least a value, then get payment status
          if (this.pendingRequests.length > 0) {
            setTimeout(e => {
              this._getPaymentStatus();
            }, 500);
          }
        } else {
          this.pendingRequests = [];
        }
      } else {
        this.pendingRequests = [];
      }
    }).catch(err => this._notification('Error', 'There was a problem getting pending requests!'));
  }

  onClickInvestigation(investigation: PendingLaboratoryRequest, index) {
    // Highlight the item that was selected
    this.activeInvestigationNo = index;

    if (investigation.isPaid) {
      if (investigation.sampleTaken) {
        this.selectedPatient = investigation.patient;
        this.selectedInvestigation = investigation;
        this.apmisLookupText = investigation.patient.personDetails.personFullName;
        if (this.selectedInvestigation.reportType.name.toLowerCase() === 'text'.toLowerCase()) {
          this.textReport = true;
          this.numericReport = false;
        } else {
          this.numericReport = true;
          this.textReport = false;
        }
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
      } else {
        const text = 'You can not attend to this request as sample has not been taken. ';
        this._notification('Info', text.concat('Please use the refresh button above to check if sample has been taken.'));
      }
    } else {
      const text = 'You can not attend to this request as payment has not been made. ';
      this._notification('Info', text.concat(' Please use the refresh button above to check for payment status.'));
    }
  }

  onClickImportTemplate(selectedInvestigation: PendingLaboratoryRequest) {
    console.log(selectedInvestigation);
    this.importTemplate = true;
  }

  private _getAllReports() {
    this._laboratoryRequestService.find({
      query: {
        'facilityId._id': this.facility._id,
      }
    }).then(res => {
      console.log(res);
      if (!!this.selectedLab.typeObject.minorLocationId || this.selectedLab.typeObject.minorLocationId !== undefined) {
        this.reportLoading = false;
        if (res.data.length > 0) {
          const reports = this._modelPendingRequests(res.data);

          if (reports.length > 0) {
            this.reports = reports.filter(x => x.isUploaded || x.isSaved);
          } else {
            this.reports = [];
          }
        } else {
          this.reports = [];
        }
      } else {
        this._notification('Error', 'There was a problem getting pending requests. Please try again later!');
      }
    }).catch(err => this._notification('Error', 'There was a problem getting pending requests. Please try again later!'));
  }

  private CheckIfSelectedPatient() {
    if (!!this.selectedPatient && this.selectedPatient.hasOwnProperty('_id')) {
      this.patientSelected = true;
    } else {
      this.patientSelected = false;
    }
  }

  private _modelPendingRequests(data: any): PendingLaboratoryRequest[] {
    const pendingRequests = [];
    const labId = this.selectedLab.typeObject.minorLocationId;
    // Filter investigations based on the laboratory Id
    data.forEach(labRequest => {
      console.log(labRequest);
      labRequest.investigations.forEach(investigation => {
        console.log(investigation);
        if (!investigation.isExternal) {
          if (labId === investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id) {
            const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
            if (investigation.isSaved || investigation.isUploaded) {
              pendingLabReq.report = investigation.report;
              pendingLabReq.isSaved = investigation.isSaved;
              pendingLabReq.isUploaded = investigation.isUploaded;
            }

            if (investigation.specimenReceived !== undefined) {
              pendingLabReq.specimenReceived = investigation.specimenReceived;
            }

            if (investigation.specimenNumber !== undefined) {
              pendingLabReq.specimenNumber = investigation.specimenNumber;
            }

            if (investigation.sampleTaken !== undefined) {
              pendingLabReq.sampleTaken = investigation.sampleTaken;
            }

            if (investigation.sampleTakenBy !== undefined) {
              pendingLabReq.sampleTakenBy = investigation.sampleTakenBy;
            }

            pendingLabReq.billingId = labRequest.billingId;
            pendingLabReq.labRequestId = labRequest._id;
            pendingLabReq.facility = labRequest.facilityId;
            pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
            pendingLabReq.diagnosis = labRequest.diagnosis;
            pendingLabReq.labNumber = labRequest.labNumber;
            pendingLabReq.patient = labRequest.patientId;
            pendingLabReq.createdBy = labRequest.createdBy;
            pendingLabReq.isExternal = investigation.isExternal;
            pendingLabReq.isUrgent = investigation.isUrgent;
            pendingLabReq.minorLocation = investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id;
            pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
            pendingLabReq.isPanel = investigation.investigation.isPanel;
            pendingLabReq.name = investigation.investigation.name;
            pendingLabReq.reportType = investigation.investigation.reportType;
            pendingLabReq.specimen = investigation.investigation.specimen;
            pendingLabReq.service = investigation.investigation.serviceId;
            pendingLabReq.unit = investigation.investigation.unit;
            pendingLabReq.investigationId = investigation.investigation._id;
            pendingLabReq.createdAt = investigation.investigation.createdAt;
            pendingLabReq.updatedAt = investigation.investigation.updatedAt;
            pendingLabReq.isPaid = false;

            pendingRequests.push(pendingLabReq);
          }
        }
      });
    });
    return pendingRequests;
  }

  // Get payment status
	private _getPaymentStatus() {
		this.disablePaymentBtn = true;
    this.paymentStatusText = 'Getting Payment Status... <i class="fa fa-spinner fa-spin"></i>';

    this.pendingRequests.forEach((request: PendingLaboratoryRequest) => {
      console.log(request);
      if (!!request.billingId) {
        this._billingService.find({
          query: {
            facilityId: this.facility._id,
            '_id': request.billingId._id,
            patientId: request.patient._id
          }
        }).then(res => {
          console.log(res);
          const billingItem = res.data[0];
          let counter = 0;
          billingItem.billItems.forEach(billItem => {
            counter++;
            if (billItem.serviceId === request.service._id) {
              request.isPaid = billItem.paymentCompleted;
            }
          });

          if (counter === billingItem.billItems.length) {
            this.disablePaymentBtn = false;
            this.paymentStatusText = '<i class="fa fa-refresh"></i> Refresh Payment Status';
          }
        }).catch(err => console.log(err));
      }
    });
  }

  onClickRefreshPaymentStatus() {
    this._getPaymentStatus();
  }

  onClickTemplate(event) {
    this.importTemplate = false;
    if (event.investigation.investigation.reportType.name === this.selectedInvestigation.reportType.name) {
      this.reportFormGroup.controls['result'].setValue(event.investigation.result);
      this.reportFormGroup.controls['recommendation'].setValue(event.investigation.recommendation);
      this.reportFormGroup.controls['conclusion'].setValue(event.investigation.conclusion);
    } else {
      this._notification('Info', 'Please create a template for this report type.');
    }
  }

  private _getDocumentationForm() {
    this._formService.findAll().then(res => {
      this.selectedForm = res.data.filter(x => new RegExp('laboratory', 'i').test(x.title))[0];
    }).catch(err => this._notification('Error', 'There was a problem getting documentations!'));
  }

  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

  showDoc_toggle() {
    this.docAction = !this.docAction;
  }

  showDiagnosis_toggle() {
    this.diagnosisAction = !this.diagnosisAction;
  }

  close_onClick(message: Boolean): void {
    this.repDetail_view = false;
    this.importTemplate = false;
  }

  report_show() {
    this.report_view = !this.report_view;
  }

  repDetail(value: PendingLaboratoryRequest) {
    this.selectedInvestigationData = value;
    this.repDetail_view = true;
  }
}
