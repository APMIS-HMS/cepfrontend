import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Locker } from 'angular2-locker';
import { Facility } from '../../../../models/index';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-dispense',
  templateUrl: './dispense.component.html',
  styleUrls: ['./dispense.component.scss']
})
export class DispenseComponent implements OnInit {
  facility: Facility = <Facility>{};
  noPrescriptionForm: FormGroup;
  prescriptionId: string = '';
  units: string[];
  locations: string[];
  departments: string[];
  drugs: string[];
  selectedDept: string;
  billshow = false;
  hasPrescription = true;
  noPrescription = false;
  individualShow = true;
  corporateShow = false;
  internalShow = false;


  constructor(
    private _fb: FormBuilder,
    private _locker: Locker,
    private _route: ActivatedRoute,
    private _facilityService: FacilitiesService,
    private _DispenseService: FacilitiesService
  ) {

  }

  ngOnInit() {
    this.facility = this._locker.get('selectedFacility');
    this._route.params.subscribe(params => {
      console.log(params)
      this.prescriptionId = params['id'];
    });

    this.getFacilityData();

    this.noPrescriptionForm = this._fb.group({
      client: ['', [<any>Validators.required]],
      lastname: ['', [<any>Validators.required]],
      firstname: ['', [<any>Validators.required]],
      phone: ['', [<any>Validators.required]],
      companyname: ['', [<any>Validators.required]],
      corporatephone: ['', [<any>Validators.required]],
      dept: ['', [<any>Validators.required]],
      unit: [''],
      location: [''],
      drug: [''],
      qty: ['']
    });

    this.noPrescriptionForm.controls['dept'].valueChanges.subscribe(val => {
      this.selectedDept = val;
      this.getFacilityData();
    });
  }

  onClickSaveNoPrescription(value: any, valid: boolean) {
    console.log(value);
  }

  getFacilityData() {
    this._facilityService.get(this.facility._id, {})
      .then(res => {
        console.log(res);
        this.departments = res.departments;
        this.locations = res.minorLocations;

        for (let i = 0; i < res.departments.length; i++) {
          let dept = res.departments[i];
          console.log(dept);
          if (dept._id === this.selectedDept) {
            console.log(dept.units);
            this.units = dept.units;
            return;
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  billToggle() {
    this.billshow = !this.billshow;
  }
  hasPrescriptionShow() {
    this.hasPrescription = true;
    this.noPrescription = false;
  }
  noPrescriptionShow() {
    this.noPrescription = true;
    this.hasPrescription = false;
  }
  onChange(param) {
    switch (param) {
      case 'Individual':
        this.individualShow = true;
        this.corporateShow = false;
        this.internalShow = false;
        break;
      case 'Corporate':
        this.individualShow = false;
        this.corporateShow = true;
        this.internalShow = false;
        break;
      case 'Internal':
        this.individualShow = false;
        this.corporateShow = false;
        this.internalShow = true;
        break;
    }
  }

}
