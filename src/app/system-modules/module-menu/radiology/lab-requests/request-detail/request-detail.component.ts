
import { CoolLocalStorage } from 'angular2-cool-storage';
import { User } from './../../../../../models/facility-manager/setup/user';
import { LaboratoryRequestService } from './../../../../../services/facility-manager/setup/laboratoryrequest.service';
import { Investigation, Patient } from './../../../../../models/index';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild, Input } from '@angular/core';
import { FacilitiesService, PatientService } from '../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-rad-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RadRequestDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() investigation: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  specimenNumber: FormControl = new FormControl();
  labNumber: FormControl = new FormControl();

  showDocument = false;
  hasNo = false;
  hasSample = false;
  hasSpecimen = false;
  hasLabNo = false;
  localInvestigation: any = <any>{};
  localInvestigationIndex = -1;
  localRequest: any = <any>{};
  user: User = <User>{};
  selectedPatient: Patient = <Patient>{};
  selectedLab: any = <any>{};
  client: any = <any>{};

  constructor(private renderer: Renderer, private facilityService: FacilitiesService,
    private _locker: CoolLocalStorage, private patientService: PatientService,
    private _laboratoryRequestService: LaboratoryRequestService) { }

  ngOnInit() {
    this.user = <User>this._locker.getObject('auth');
    this.selectedLab = <any>this._locker.getObject('workbenchCheckingObject');
    this.getIncomingRequest(this.investigation.labRequestId);
    this.getIncomingPatient();
  }
  getIncomingPatient() {
    this.patientService.get(this.investigation.patient._id, {}).then(patient => {
      if (patient !== undefined) {
        this.selectedPatient = patient;
        if (this.selectedPatient.clientsNo === undefined) {
          this.selectedPatient.clientsNo = [];
        } else {
          let index = this.selectedPatient.clientsNo.findIndex(x => x.minorLocationId._id === this.selectedLab.typeObject.minorLocationObject._id);
          if (index > -1) {
            this.client = this.selectedPatient.clientsNo[index];
            this.hasLabNo = true;
          }
        }
      }
    })
  }
  getIncomingRequest(id) {
    this._laboratoryRequestService.get(id, {}).then(payload => {
      let index = payload.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
      let _investigation = payload.investigations[index];
      this.localInvestigation = _investigation;
      this.localRequest = payload;
      if (this.localInvestigation.specimenReceived !== undefined && this.localInvestigation.specimenReceived === true) {
        this.hasSpecimen = true;
      } else {
        this.hasSpecimen = false;
      }
      if (this.localInvestigation.sampleTaken !== undefined && this.localInvestigation.sampleTaken === true){
        this.hasSample = true;
      }else{
        this.hasSample = false;
      }

    })
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange() {
    //upload file
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  takeSample() {
    this.localInvestigation.sampleTaken = true;
    const logEmp = <any>this._locker.getObject('loginEmployee');
    delete logEmp.department;
    delete logEmp.employeeFacilityDetails;
    delete logEmp.role;
    delete logEmp.units;
    delete logEmp.consultingRoomCheckIn;
    delete logEmp.storeCheckIn;
    delete logEmp.unitDetails;
    delete logEmp.professionObject;
    delete logEmp.workSpaces;
    delete logEmp.employeeDetails.countryItem;
    delete logEmp.employeeDetails.homeAddress;
    delete logEmp.employeeDetails.gender;
    delete logEmp.employeeDetails.maritalStatus;
    delete logEmp.employeeDetails.nationality;
    delete logEmp.employeeDetails.nationalityObject;
    delete logEmp.employeeDetails.nextOfKin;
    delete logEmp.workbenchCheckIn;
    this.localInvestigation.sampleTakenBy = logEmp;
    this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
    this._laboratoryRequestService.update(this.localRequest).then(pay => {
      let index = pay.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
      let _investigation = pay.investigations[index];
      this.localInvestigation = _investigation;
      this.localRequest = pay;
      this.hasSample = true;
      this._notification('Success', 'Specimen taken successfully!');
    }).catch(err => this._notification('Error', 'There was an error taken specimen. Please try again later!'));
  }
  receiveSpecimen() {
    this.localInvestigation.specimenReceived = true;
    this.localInvestigation.specimenNumber = this.specimenNumber.value;

    this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
    this._laboratoryRequestService.update(this.localRequest).then(pay => {
      let index = pay.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
      let _investigation = pay.investigations[index];
      this.localInvestigation = _investigation;
      this.localRequest = pay;
      this.hasSpecimen = true;
      this._notification('Success', 'Specimen Number has been updated successfully!');
    })
  }
  assignLabNo() {
    let clientNo = {
      minorLocationId: this.selectedLab.typeObject.minorLocationObject,
      clientNumber: this.labNumber.value
    }
    this.selectedPatient.clientsNo.push(clientNo);
    this.patientService.update(this.selectedPatient).then(payload => {
      this.selectedPatient = payload;
      let index = this.selectedPatient.clientsNo.findIndex(x => x.minorLocationId._id === this.selectedLab.typeObject.minorLocationObject._id);
      if (index > -1) {
        this.client = this.selectedPatient.clientsNo[index];
        this.hasLabNo = true;
      }
    });
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
