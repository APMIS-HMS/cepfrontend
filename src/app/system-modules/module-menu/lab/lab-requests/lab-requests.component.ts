import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationService, LaboratoryRequestService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-lab-requests',
  templateUrl: './lab-requests.component.html',
  styleUrls: ['./lab-requests.component.scss']
})
export class LabRequestsComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;

  selelctedFacility: Facility = <Facility>{};
  apmisLookupUrl = 'patient';
  apmisLookupText = '';
  apmisLookupQuery: any = {
  };
  apmisLookupDisplayKey = 'personDetails.personFullName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';

  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {
  };
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';

  request_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  resultStatus = false;
  apmisLookupOtherKeys = ['personDetails.email', 'personDetails.dateOfBirth'];

  checkedValues: any[] = [];
  requests: any[] = [];

  selectedPatient: any = <any>{};
  errMsg = 'you have unresolved errors';

  public frmNewRequest: FormGroup;

  constructor(private formBuilder: FormBuilder, private renderer: Renderer, private locker: CoolSessionStorage,
    private investigationService: InvestigationService, private requestService: LaboratoryRequestService) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['']
    });

    this.frmNewRequest.controls['patient'].valueChanges.subscribe(value => {
      this.apmisLookupQuery = {
        'facilityid': this.selelctedFacility._id,
        'searchtext': value
      };
    });
    this.frmNewRequest.controls['investigation'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisInvestigationLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisInvestigationLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: value, '$options': 'i' },
        }
      }
    })
    this.getLaboratoryRequest();
  }
  getLaboratoryRequest() {
    this.requestService.find({ query: { 'facilityId._id': this.selelctedFacility._id } }).then(payload => {
      this.requests = payload.data;
    })
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  onChange() {
    //upload file
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.personDetails.personFullName;
    this.selectedPatient = value;
    console.log(value)
  }
  apmisInvestigationLookupHandleSelectedItem(value) {
    if (value.action !== undefined) {
      if (value.action === 'cancel' && value.clear === true) {
        this.checkedValues = [];
        this.apmisInvestigationLookupText = '';
        this.frmNewRequest.controls['investigation'].setValue('');
      } else if (value.action === 'ok') {
        this.apmisInvestigationLookupText = '';
        this.frmNewRequest.controls['investigation'].setValue('');
      }
    } else {
      if (value.checked === true) {
        if (this.checkedValues.filter((item => item.name === value.object.name)).length === 0) {
          this.checkedValues.push(value.object);
        }
      } else {
        if (this.checkedValues.filter((item => item.name === value.object.name)).length > 0) {
          const index = this.checkedValues.findIndex((item => item.name === value.object.name));
          this.checkedValues.splice(index, 1);
        }
      }
      this.apmisInvestigationLookupText = value.object.name;
    }

  }
  request_show() {
    this.request_view = !this.request_view;
  }
  reqDetail() {
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
    console.log(valid);
    console.log(value);
    delete this.selectedPatient.appointments;
    delete this.selectedPatient.encounterRecords;
    delete this.selectedPatient.orders;
    delete this.selectedPatient.tags;
    delete this.selectedPatient.personDetails.addressObj;
    delete this.selectedPatient.personDetails.countryItem;
    delete this.selectedPatient.personDetails.homeAddress;
    delete this.selectedPatient.personDetails.maritalStatus;
    delete this.selectedPatient.personDetails.nationality;
    delete this.selectedPatient.personDetails.nationalityObject;
    delete this.selectedPatient.personDetails.nextOfKin;
  }
}
