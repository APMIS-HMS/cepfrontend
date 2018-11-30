import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../../services/module-manager/setup/location.service';
import { ProductTypeService } from './../../../../../services/facility-manager/setup/product-type.service';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-apmis-new-store',
  templateUrl: './apmis-new-store.component.html',
  styleUrls: ['./apmis-new-store.component.scss']
})
export class ApmisNewStoreComponent implements OnInit {

  tab_store = true;
  newStoreForm: FormGroup;
  selectedFacility: any = <any>{};
  minorLocations: any = [];
  locations: any = [];
  storeLocations: any = [];
  productTypes: any = [];

  constructor(private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private productTypeService: ProductTypeService) { }

  ngOnInit() {
    this.newStoreForm = this.fb.group({
      'majorLoc': [' ', Validators.required],
      'minorLocationId': [' ', Validators.required],
      'name': [' ', Validators.required],
      'productType': [' ', Validators.required],
      'description': [' ', Validators.required],
      'canDespense': [' ', Validators.required],
      'canReceivePurchaseOrder': [' ', Validators.required]
    });

    // facilityId: { type: Schema.Types.ObjectId, require: true },
    // name: { type: String, required: true },
    // description: { type: String, required: false },
    // store:[mStore],
    // minorLocationId:{ type: Schema.Types.ObjectId, require: true },
    // productTypeId:[productTypeIdModel],
    // canDespense:{ type: Boolean, 'default': false },
    // canReceivePurchaseOrder:{ type: Boolean, 'default': false }


    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.getLocationService();
    this.newStoreForm.controls['majorLoc'].valueChanges.subscribe(value => {
      this.storeLocations = this.minorLocations.filter(x => x.locationId.toString() === value.toString());
    });
  }

  tab_click(tab) {
    if (tab === 'store') {
      this.tab_store = true;
    }
  }

  getProductTypeService() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.productTypes = payload.data;
    });
  }

  getFacilityService() {
    this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
      this.minorLocations = payload.minorLocations;
    }, err => { })
  }

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
    }, err => { })
  }

}
