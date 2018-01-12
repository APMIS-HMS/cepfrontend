import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, WorkbenchService, ServicePriceService, TagService, RadiologyInvestigationService, FacilitiesServiceCategoryService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Employee, Tag, FacilityServicePrice, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-radiology-investigation-price',
  templateUrl: './radiology-investigation-price.component.html',
  styleUrls: ['./radiology-investigation-price.component.scss']
})
export class RadiologyInvestigationPriceComponent implements OnInit {
  user: User = <User>{};
  apmisLookupUrl = 'workbenches';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisLookupOtherKeys = ['radiologyCenterId.name']

  apmisInvestigationLookupUrl = 'radiology-investigations';
  apmisInvestigationLookupText = '';
  apmisInvestigationLookupQuery: any = {
  };
  apmisInvestigationLookupDisplayKey = 'name';
  apmisInvestigationLookupImgKey = '';

  pricing_view = false;
  Inactive = false;
  Active = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewPrice: FormGroup;
  selelctedFacility: Facility = <Facility>{};
  workBenches: any[] = [];
  locationIds: any[] = [];
  investigations: any[] = [];
  loginEmployee: Employee;
  selectedTag: Tag = <Tag>{};
  selectedInvestigation: any = <any>{};
  selectedWorkBench: any = <any>{};
  checkingObject: any;
  selectedModifierIndex = -1;
  selectedFacilityServicePrice: FacilityServicePrice = <FacilityServicePrice>{};
  selectedModifier: any = <any>{};
  loading: Boolean = true;
  foundPrice: Boolean = false;

  constructor(private formBuilder: FormBuilder, private locker: CoolLocalStorage,
    private investigationService: RadiologyInvestigationService, private workbenchService: WorkbenchService,
    private toastyService: ToastyService, private toastyConfig: ToastyConfig,
    private facilityPriceService: ServicePriceService, private tagService: TagService,
    private _facilityService: FacilitiesService, private facilitiesServiceCtyService: FacilitiesServiceCategoryService
  ) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.frmNewPrice = this.formBuilder.group({
      price: ['', [Validators.required]],
      investigation: ['', [Validators.required]]
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
    });

    if (this.loginEmployee.workSpaces !== undefined) {
      this.loginEmployee.workSpaces.forEach(work => {
        work.locations.forEach(loc => {
          if (loc.majorLocationId.name === 'Radiology') {
            this.locationIds.push(loc.minorLocationId._id);
          }
        })
      })
    }

    this.getWorkBenches();
    this.getTags();
    console.log("About to call all investigations");
    this.getInvestigations();
    console.log("After calling all investigations");
  }
  addToast(msg: string) {
    const toastOptions: ToastOptions = {
      title: 'Apmis',
      msg: msg,
      showClose: true,
      timeout: 5000,
      theme: 'default',
    };

    this.toastyService.info(toastOptions);
  }
  getInvestigations() {
    this.investigationService.find({
      query: {
        'facilityId._id': this.selelctedFacility._id
      }
    }).then(payload => {
      this.loading = false;
      this.investigations = payload.data;
      console.log(this.investigations);
    })
  }
  getWorkBenches() {
    this.workbenchService.find({ query: { 'radiologyCenterId._id': { $in: this.locationIds } } })
      .then(payload => {
        this.workBenches = payload.data;
      })
  }
  getTags() {
    this.checkingObject = this.locker.getObject('workbenchCheckingObject');
    if (this.checkingObject.typeObject !== undefined) {
      this.tagService.find({
        query: {
          tagType: 'Radiology Location', name: this.checkingObject.typeObject.minorLocationObject.name
        }
      }).then(payload => {
        if (payload.data.length > 0) {
          console.log(payload.data);
          this.selectedTag = payload.data[0];
        }
      });
    }

  }
  getRadiologyFromInvestigation(radWorkBenches) {
    let retVal = '';
    const radIndex = radWorkBenches.forEach(item => {
      if (item.radiologyCenterId._id === this.checkingObject.typeObject.minorLocationObject._id) {
        retVal = item.radiologyCenterId.name
      }
    });
    return retVal;
  }
  getWorkbenchFromInvestigation(radWorkBenches) {
    let retVal = '';
    const radIndex = radWorkBenches.forEach(item => {
      const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      retVal = item.workbenches[0].workBench.name
    });
    return retVal;
  }
  gePriceFromInvestigation(radWorkBenches) {
    let retVal = '';
    const radIndex = radWorkBenches.forEach(item => {
      const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      retVal = item.workbenches[0].price;
    });
    return retVal;
  }
  reqDetail(investigationPrice) {
    this.pricing_view = true;
    let retVal;
    const radIndex = investigationPrice.radiologyWorkbenches.forEach(item => {
      const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      retVal = item.workbenches[0].workBench;
    });
    // this.selectedWorkBench = retVal;
    this.frmNewPrice.controls['workbench'].setValue(retVal.name)
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this.selectedWorkBench = value;
  }
  apmisInvestigationLookupHandleSelectedItem(value) {
    this.selectedInvestigation = value;
    this.apmisInvestigationLookupText = value.name;
  }

  pricing_show() {
    this.pricing_view = !this.pricing_view;
  }

  close_onClick(message: boolean): void {

  }
  setPrice(valid, value) {
    // facilityServiceId: { type: Schema.Types.ObjectId, require: true },
    // categoryId: { type: Schema.Types.ObjectId, require: true },
    // serviceId: { type: Schema.Types.ObjectId, require: true },
    // facilityId:{ type: Schema.Types.ObjectId, require: true },
    // modifiers :  [Schema.Types.Mixed],
    // price:{ type: Number, require: true },
    this.facilitiesServiceCtyService.get(this.selectedInvestigation.facilityServiceId, {}).then(payload => {
      var ctgy = payload.categories.filter(x => x.name == 'Radiology');
      console.log(ctgy);
      var priceObj = {
        'facilityServiceId': this.selectedInvestigation.facilityServiceId,
        'categoryId': ctgy[0]._id,
        'serviceId': this.selectedInvestigation.serviceId,
        'facilityId': this.selelctedFacility._id,
        'price': this.frmNewPrice.controls['price'].value
      };
      this.facilityPriceService.create(priceObj).then(payload2 => {
        this._notification("Success", "Price created successful");
        this.apmisInvestigationLookupText = "";
        this.frmNewPrice.reset();
        this.getInvestigations();
      }, error => {
        this._notification("Error", "Fail to created price");
      })
    });
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}

