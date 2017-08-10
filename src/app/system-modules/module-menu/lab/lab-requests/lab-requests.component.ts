import { Component, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
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
  request_view = false;
  reqDetail_view = false;
  personAcc_view = false;
  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  resultStatus = false;
  apmisLookupOtherKeys = ['personDetails.email','personDetails.dateOfBirth'];

  errMsg = 'you have unresolved errors';

  public frmNewRequest: FormGroup;

  constructor(private formBuilder: FormBuilder, private renderer: Renderer, private locker: CoolSessionStorage) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['', [Validators.required]]
    });

    this.frmNewRequest.controls['patient'].valueChanges.subscribe(value => {
      console.log(value);
      this.apmisLookupQuery = {
        'facilityid': this.selelctedFacility._id,
        'searchtext': value
      };
      // this.apmisLookupQuery.facilityId = this.selelctedFacility._id;
      // this.apmisLookupQuery.searchtext = value;
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
    console.log(value);
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
}
