import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, WorkbenchService, ServicePriceService, TagService, RadiologyInvestigationService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Employee, Tag, FacilityServicePrice, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

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
    private _facilityService: FacilitiesService
  ) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
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
    });
    this.frmNewPrice.controls['workbench'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisLookupQuery = {
          'facilityId._id': this.selelctedFacility._id,
          'radiologyCenterId._id': { $in: this.locationIds },
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
        'facilityId._id': this.selelctedFacility._id,
        'radiologyWorkbenches.radiologyCenterId._id': this.checkingObject.typeObject.minorLocationObject._id
        // "LaboratoryWorkbenches": { $elemMatch: { 'laboratoryId._id': this.checkingObject.typeObject.minorLocationObject._id } }
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
    this.selectedModifier = undefined;
    this.selectedModifierIndex = -1;
    this.foundPrice = false;
    this.apmisInvestigationLookupText = value.name;
    this.selectedInvestigation = value;
    if (this.selectedInvestigation.radiologyWorkbenches === undefined) {
      this.selectedInvestigation.radiologyWorkbenches = [];
      this.frmNewPrice.controls['price'].setValue(0);
    }
    console.log(this.selectedInvestigation);
    this.facilityPriceService.find({ query: { serviceId: this.selectedInvestigation.serviceId._id } }).then(payload => {
      console.log(payload);
      this.selectedFacilityServicePrice = payload.data.length > 0 ? payload.data[0] : undefined;
      console.log(this.selectedFacilityServicePrice);
      this.selectedFacilityServicePrice.modifiers.forEach((item, i) => {
        if (item.tagDetails !== undefined) {
          delete item.tagDetails;
        }
        if (item.tagId != undefined) {
          console.log(item.tagId);
          console.log(this.selectedTag);
          if (item.tagId._id === this.selectedTag._id && item.tagId.tagType === 'Radiology Location'
            && item.tagId.name === this.checkingObject.typeObject.minorLocationObject.name) {
            this.foundPrice = true;
            this.selectedModifier = item;
            this.selectedModifierIndex = i;
            this.frmNewPrice.controls['price'].setValue(item.modifierValue);
          }
        }
      })
      if (!this.foundPrice) {
        this.frmNewPrice.controls['price'].setValue(0);
      }
    });

  }
  pricing_show() {
    this.pricing_view = !this.pricing_view;
  }

  close_onClick(message: boolean): void {

  }
  setPrice(valid, value) {
    if (this.selectedTag.tagDetails !== undefined) {
      delete this.selectedTag.tagDetails;
    }
    if (this.foundPrice) {
      this.selectedModifier.modifierValue = this.frmNewPrice.controls['price'].value;
      this.selectedFacilityServicePrice.modifiers[this.selectedModifierIndex] = this.selectedModifier;
    } else {
      const modifier: any = <any>{};
      modifier.tagId = this.selectedTag;
      modifier.modifierType = 'Amount';
      modifier.modifierValue = this.frmNewPrice.controls['price'].value;
      this.selectedFacilityServicePrice.modifiers.push(modifier);
    }
    const iExisting = false;
    let radCollectionObject: any;
    console.log(this.selectedInvestigation.radiologyWorkbenches);
    console.log(this.checkingObject.typeObject.minorLocationObject);
    const radIndex = this.selectedInvestigation.radiologyWorkbenches.findIndex(x => x.radiologyCenterId._id === this.checkingObject.typeObject.minorLocationObject._id);
    if (radIndex === -1) {
      // is not existing
      // create a new collection object;
      radCollectionObject = {
        radiologyCenterId: this.checkingObject.typeObject.minorLocationObject,
        workbenches: [{ workBench: this.selectedWorkBench, price: this.frmNewPrice.controls['price'].value }],
      }
      this.selectedInvestigation.radiologyWorkbenches.push(radCollectionObject);

    } else {
      // is existing
      radCollectionObject = this.selectedInvestigation.radiologyWorkbenches[radIndex];
      console.log(radCollectionObject);
      const index = radCollectionObject.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      console.log(index);
      radCollectionObject.workbenches[index].price = this.frmNewPrice.controls['price'].value;
      // labCollectionObject.price = this.frmNewPrice.controls['price'].value;
      this.selectedInvestigation.radiologyWorkbenches[radIndex] = radCollectionObject;
    }

    const updateInvestigation$ = Observable.fromPromise(this.investigationService.update(this.selectedInvestigation));
    const updatePrice$ = Observable.fromPromise(this.facilityPriceService.update(this.selectedFacilityServicePrice));

    Observable.forkJoin([updateInvestigation$, updatePrice$]).subscribe((result: any) => {
      console.log(result);
      this.selectedInvestigation = result[0];
      this.selectedFacilityServicePrice = result[1];


      this.frmNewPrice.reset();
      this.frmNewPrice.controls['investigation'].reset();
      this.frmNewPrice.controls['workbench'].reset();
      this.getInvestigations();
      // this.addToast('Price set/updated successfully');
      this._notification('Success', 'Price set/updated successfully');
    })

    // this.facilityPriceService.update(this.selectedFacilityServicePrice).then(payload => {
    //   this.selectedFacilityServicePrice = payload;
    //   this.frmNewPrice.reset();
    //   this.frmNewPrice.controls['investigation'].reset();
    //   this.frmNewPrice.controls['workbench'].reset();
    // });
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}

