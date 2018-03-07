
import { CoolLocalStorage } from 'angular2-cool-storage';
import { User } from './../../../../../models/facility-manager/setup/user';
import { LaboratoryRequestService } from './../../../../../services/facility-manager/setup/laboratoryrequest.service';
import { Investigation, Patient, Employee } from './../../../../../models/index';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild, Input } from '@angular/core';
import { FacilitiesService, PatientService } from '../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss']
})
export class RequestDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() investigation: any;
  @ViewChild('fileInput') fileInput: ElementRef;

  specimenNumber: FormControl = new FormControl();
  labNumber: FormControl = new FormControl();
  loginEmployee: Employee;
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
    private _laboratoryRequestService: LaboratoryRequestService,
    private _authFacadeService: AuthFacadeService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
    }).catch(err => console.log(err));
    }

  ngOnInit() {
    this.user = <User>this._locker.getObject('auth');
this.getIncomingPatient();
  }
  getIncomingPatient() {
    this.patientService.get(this.investigation.patientId, {}).then(patient => {
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
      console.log(this.localInvestigation);
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

    });
  }


  getIncomingRequestAndPatient(id) {
    this._laboratoryRequestService.get(id, {}).then(payload => {
      this.patientService.get(this.investigation.patientId, {}).then(patient => {
        console.log(payload, patient);
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
        let requestIndex = payload.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
        let _investigation = payload.investigations[requestIndex];
        this.localInvestigation = _investigation;
        console.log(this.localInvestigation);
        this.localRequest = payload;
        if ((this.localInvestigation.specimenReceived !== undefined && this.localInvestigation.specimenReceived === true) || (this.localInvestigation.sampleTaken !== undefined && this.localInvestigation.sampleTaken === true) ) {
          this.hasSpecimen = true;
        } else {
          this.hasSpecimen = false;
        }
        /* if (this.localInvestigation.sampleTaken !== undefined && this.localInvestigation.sampleTaken === true) {
          this.hasSample = true;
        } else {
          this.hasSample = false;
        } */
      })

    });
  }



  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange() {
    //upload file
  }
  close_onClick(event) {
    this.closeModal.emit(true);
  }
  takeSample() {
    this.localInvestigation.sampleTaken = true;
    const logEmp = this.loginEmployee;
    delete logEmp.personDetails.wallet;
    this.localInvestigation.sampleTakenBy = logEmp.personDetails;
    this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
    this._laboratoryRequestService.patch(this.localRequest._id, this.localRequest, {}).then(pay => {
      this._notification('Success', 'Specimen taken successfully!');
      let index = pay.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
      let _investigation = pay.investigations[index];
      this.localInvestigation = _investigation;
      this.localRequest = pay;
      this.hasSample = true;
    }).catch(err => this._notification('Error', 'There was an error taken specimen. Please try again later!'));
  }
  receiveSpecimen() {
    this.localInvestigation.specimenReceived = true;
    this.localInvestigation.specimenNumber = this.specimenNumber.value;

    this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
    this._laboratoryRequestService.patch(this.localRequest._id, this.localRequest, {}).then(pay => {
      this._notification('Success', 'Specimen Number has been updated successfully!');
      let index = pay.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
      let _investigation = pay.investigations[index];
      this.localInvestigation = _investigation;
      this.localRequest = pay;
      this.hasSpecimen = true;
    }).catch(err => {
      console.log(err);
    });
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
