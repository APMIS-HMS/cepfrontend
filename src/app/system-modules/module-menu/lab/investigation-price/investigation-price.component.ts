import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, WorkbenchService, ServicePriceService, TagService
 } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Employee, Tag, FacilityServicePrice, User} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Component({
  selector: 'app-investigation-price',
  templateUrl: './investigation-price.component.html',
  styleUrls: ['./investigation-price.component.scss']
})
export class InvestigationPriceComponent implements OnInit {
  user: User = <User>{};
  apmisLookupUrl = 'workbenches';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisLookupOtherKeys = ['laboratoryId.name']

  apmisInvestigationLookupUrl = 'investigations';
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
    private investigationService: InvestigationService, private workbenchService: WorkbenchService,
    private toastyService: ToastyService, private toastyConfig: ToastyConfig,
    private facilityPriceService: ServicePriceService, private tagService: TagService,
    private _facilityService: FacilitiesService
  ) { }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User> this.locker.getObject('auth');
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
          if (loc.majorLocationId.name === 'Laboratory') {
            this.locationIds.push(loc.minorLocationId._id);
          }
        })
      })

    }
    this.getWorkBenches();
    this.getTags();
    this.getInvestigations();
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
        'LaboratoryWorkbenches.laboratoryId._id': this.checkingObject.typeObject.minorLocationObject._id
        // "LaboratoryWorkbenches": { $elemMatch: { 'laboratoryId._id': this.checkingObject.typeObject.minorLocationObject._id } }
      }
    }).then(payload => {
      this.loading = false;
      this.investigations = payload.data;
    })
  }
  getWorkBenches() {
    this.workbenchService.find({ query: { 'laboratoryId._id': { $in: this.locationIds } } })
      .then(payload => {
        this.workBenches = payload.data;
      })
  }
  getTags() {
    this.checkingObject = this.locker.getObject('workbenchCheckingObject');
    if (this.checkingObject.typeObject !== undefined) {
      this.tagService.find({ query: {
        tagType: 'Laboratory Location', name: this.checkingObject.typeObject.minorLocationObject.name }
      }).then(payload => {
        if (payload.data.length > 0) {
          this.selectedTag = payload.data[0];
        }
      });
    }

  }
  getLaboratoryFromInvestigation(labworkBenches) {
    let retVal = '';
    const labIndex = labworkBenches.forEach(item => {
      if (item.laboratoryId._id === this.checkingObject.typeObject.minorLocationObject._id) {
        retVal = item.laboratoryId.name
      }
    });
    return retVal;
  }
  getWorkbenchFromInvestigation(labworkBenches) {
    let retVal = '';
    const labIndex = labworkBenches.forEach(item => {
      const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      retVal = item.workbenches[0].workBench.name
    });
    return retVal;
  }
  gePriceFromInvestigation(labworkBenches) {
    let retVal = '';
    const labIndex = labworkBenches.forEach(item => {
      const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
      retVal = item.workbenches[0].price;
    });
    return retVal;
  }
  reqDetail(investigationPrice) {
    this.pricing_view = true;
    let retVal;
    const labIndex = investigationPrice.LaboratoryWorkbenches.forEach(item => {
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
    if (this.selectedInvestigation.LaboratoryWorkbenches === undefined) {
      this.selectedInvestigation.LaboratoryWorkbenches = [];
      this.frmNewPrice.controls['price'].setValue(0);
    }
    this.facilityPriceService.find({ query: { serviceId: this.selectedInvestigation.serviceId._id } }).then(payload => {
      this.selectedFacilityServicePrice = payload.data.length > 0 ? payload.data[0] : undefined;

      this.selectedFacilityServicePrice.modifiers.forEach((item, i) => {
        if (item.tagDetails !== undefined) {
          delete item.tagDetails;
        }

        if (item.tagId._id === this.selectedTag._id && item.tagId.tagType === 'Laboratory Location'
          && item.tagId.name === this.checkingObject.typeObject.minorLocationObject.name) {
          this.foundPrice = true;
          this.selectedModifier = item;
          this.selectedModifierIndex = i;
          this.frmNewPrice.controls['price'].setValue(item.modifierValue);
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


    const isLabExisting = false;
    let labCollectionObject: any;
    const labIndex = this.selectedInvestigation.LaboratoryWorkbenches.findIndex(x => x.laboratoryId._id === this.checkingObject.typeObject.minorLocationObject._id);
    if (labIndex === -1) {
      // is not existing
      // create a new collection object;
      labCollectionObject = {
        laboratoryId: this.checkingObject.typeObject.minorLocationObject,
        workbenches: [{ workBench: this.selectedWorkBench, price: this.frmNewPrice.controls['price'].value }],
      }
      this.selectedInvestigation.LaboratoryWorkbenches.push(labCollectionObject);

    } else {
      // is existing
      labCollectionObject = this.selectedInvestigation.LaboratoryWorkbenches[labIndex];
      const index = labCollectionObject.workbenches.findIndex(x => x.workBench.id === this.selectedWorkBench._id);
      labCollectionObject.workbenches[index].price = this.frmNewPrice.controls['price'].value;
      // labCollectionObject.price = this.frmNewPrice.controls['price'].value;
      this.selectedInvestigation.LaboratoryWorkbenches[labIndex] = labCollectionObject;
    }

    const updateInvestigation$ = Observable.fromPromise(this.investigationService.update(this.selectedInvestigation));
    const updatePrice$ = Observable.fromPromise(this.facilityPriceService.update(this.selectedFacilityServicePrice));

    Observable.forkJoin([updateInvestigation$, updatePrice$]).subscribe((result: any) => {
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

