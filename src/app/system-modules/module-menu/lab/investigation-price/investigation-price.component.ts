import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, InvestigationService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation } from '../../../../models/index';
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

  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage,
    private investigationService: InvestigationService) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
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
          name: { $regex: value, '$options': 'i' },
        }
      }
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

