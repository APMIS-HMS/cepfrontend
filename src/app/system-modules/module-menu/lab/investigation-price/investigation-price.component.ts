import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationService, WorkbenchService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Employee } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-investigation-price',
  templateUrl: './investigation-price.component.html',
  styleUrls: ['./investigation-price.component.scss']
})
export class InvestigationPriceComponent implements OnInit {

  apmisLookupUrl = 'workbenches';
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey = "name";
  apmisLookupOtherKeys = ['laboratoryId.name']

  apmisInvestigationLookupUrl = 'investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {
  };
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';

  pricing_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewPrice: FormGroup;
  selelctedFacility: Facility = <Facility>{};
  workBenches: any[] = [];
  locationIds: any[] = [];
  loginEmployee: Employee;

  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage,
    private investigationService: InvestigationService, private workbenchService: WorkbenchService,
  ) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.frmNewPrice = this.formBuilder.group({
      price: ['', [Validators.required]],
      investigation: ['', [Validators.required]],
      workbench: ['', [Validators.required]]
    });

    this.frmNewPrice.controls['investigation'].valueChanges.subscribe(value => {
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

    this.frmNewPrice.controls['workbench'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          'laboratoryId._id': { $in: this.locationIds },
          name: { $regex: value, '$options': 'i' },
        }
      }
    })

    if (this.loginEmployee.workSpaces !== undefined) {
      this.loginEmployee.workSpaces.forEach(work => {
        work.locations.forEach(loc => {
          if (loc.majorLocationId.name === "Laboratory") {
            this.locationIds.push(loc.minorLocationId._id);
          }

        })
      })

    }
    this.getWorkBenches();
  }
  getWorkBenches() {
    this.workbenchService.find({ query: { 'laboratoryId._id': { $in: this.locationIds } } })
      .then(payload => {
        console.log(payload);
        this.workBenches = payload.data;
      })
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
  }
  apmisInvestigationLookupHandleSelectedItem(value) {
    this.apmisInvestigationLookupText = value.name;
  }
  pricing_show() {
    this.pricing_view = !this.pricing_view;
  }

  close_onClick(message: boolean): void {

  }
}

