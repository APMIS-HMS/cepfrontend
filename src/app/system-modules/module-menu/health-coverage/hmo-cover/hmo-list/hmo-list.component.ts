import { User } from './../../../../../models/facility-manager/setup/user';
import { CoolSessionStorage } from 'angular2-cool-storage';

import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { HmoService, FacilitiesService, FacilityTypesService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-hmo-list',
  templateUrl: './hmo-list.component.html',
  styleUrls: ['./hmo-list.component.scss']
})
export class HmoListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmNewHmo: FormGroup;
  hmo = new FormControl('', []);
  newHmo = false;
  newHMO = false;

  apmisLookupUrl = 'facilities';
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey = "name";
  apmisLookupOtherKeys = []

  selelctedFacility: Facility = <Facility>{};
  selectedHMO: Facility = <Facility>{};
  selectedFacilityType: FacilityType = <FacilityType>{};
  loginHMOListObject: any = <any>{};
  user: User = <User>{};

  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private facilityService: FacilitiesService,
    private facilityTypeService: FacilityTypesService, private locker: CoolSessionStorage) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('miniFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.frmNewHmo.controls['name'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityTypeId': this.selectedFacilityType._id,
          name: { $regex: -1, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'shortName', 'website', 'logoObject']
        }
      } else {
        this.apmisLookupQuery = {
          'facilityTypeId': this.selectedFacilityType._id,
          name: { $regex: value, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'shortName', 'website', 'logoObject']
        }
      }
    });
    this.getFacilityTypes();
    this.getLoginHMOList();
  }
  getLoginHMOList() {
    this.hmoService.find({
      query: {
        'facilityId._id': this.selelctedFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.loginHMOListObject = payload.data[0];
      } else {
        this.loginHMOListObject.hmos = [];
      }
    })
  }
  getFacilityTypes() {
    this.facilityTypeService.findAll().then(payload => {
      payload.data.forEach(item => {
        if (item.name === 'Hospital') {
          this.selectedFacilityType = item;
        }
      });
    })
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
    this.loginHMOListObject.hmos.forEach(item => {
      if (item._id === value._id) {
        isExisting = true;
      }
    });
    if (!isExisting) {
      this.selectedHMO = value;
    } else {
      this.selectedHMO = <any>{};
      this._notification('Info', 'Selected HMO is already in your list of HMOs');
    }
  }

  newHmo_show() {
    this.newHmo = !this.newHmo;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
  onChange(e) {

  }
  public upload(e, hmo) {
    console.log('am here')

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      console.log(fileBrowser.files);
      const formData = new FormData();
      formData.append("excelfile", fileBrowser.files[0]);
      formData.append("hmoId", hmo._id);
      console.log(formData)
      this.facilityService.upload(formData, this.selectedHMO._id).then(res => {
        // do stuff w/my uploaded file
        // console.log(res);
        if(res.body !== undefined && res.body.error_code===0){
          console.log(res.body.data)
        }
      }).catch(err => {
        this._notification('Error', "There was an error uploading the file");
      });
    }
  }
  save(valid, value) {
    this.loginHMOListObject.facilityId = this.selelctedFacility;
    this.loginHMOListObject.hmos.push(this.selectedHMO);
    if (this.selectedHMO._id !== undefined) {
      if (this.loginHMOListObject._id === undefined) {
        this.hmoService.create(this.loginHMOListObject).then(payload => {
          console.log(payload);
          this._notification('Success', 'Selected HMO added to your HMO list successfully');
          this.frmNewHmo.reset();
        })
      } else {
        this.hmoService.update(this.loginHMOListObject).then(payload => {
          this._notification('Success', 'Selected HMO added to your HMO list successfully');
          this.frmNewHmo.reset();
        })
      }
    }
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
