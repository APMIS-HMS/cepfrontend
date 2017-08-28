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

  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private facilityService: FacilitiesService,
    private facilityTypeService: FacilityTypesService, private locker: CoolSessionStorage) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('miniFacility');
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
    });

    this.frmNewHmo.controls['name'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityTypeId': this.selectedFacilityType._id,
          name: { $regex: -1, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'shortName', 'website', 'logoObject']
        }
      } else {
        console.log(value)
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
      })
      console.log(payload);
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
  save(valid, value) {
    console.log(valid);
    console.log(value);

    this.loginHMOListObject.facilityId = this.selelctedFacility;
    this.loginHMOListObject.hmos.push(this.selectedHMO);
    if (true) {
      if (this.loginHMOListObject._id === undefined) {
        this.hmoService.create(this.loginHMOListObject).then(payload => {
          console.log(payload);
          this.frmNewHmo.reset();
        })
      }
    }
  }
}
