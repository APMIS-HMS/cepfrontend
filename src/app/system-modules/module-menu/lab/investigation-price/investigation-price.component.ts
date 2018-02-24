import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationService, WorkbenchService, ServicePriceService, TagService
 } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, Employee, Tag, FacilityServicePrice, User} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


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
  apmisLookupOtherKeys = ['name']

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
  selectedMajorLocation: any;

  constructor(private formBuilder: FormBuilder, private locker: CoolLocalStorage,
    private investigationService: InvestigationService, private workbenchService: WorkbenchService,
    private facilityPriceService: ServicePriceService, private tagService: TagService,
    private _facilityService: FacilitiesService,
    private _locationService: LocationService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
      this.getLaboratoryMajorLocation(this.loginEmployee);
    }).catch(err => console.log(err));
  }

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
          'facilityId': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisInvestigationLookupQuery = {
          'facilityId': this.selelctedFacility._id,
          name: { $regex: value, '$options': 'i' },
        }
      }
    })

    this.frmNewPrice.controls['workbench'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          'facilityId': this.selelctedFacility._id,
          name: { $regex: -1, '$options': 'i' },
        }
      } else {
        this.apmisLookupQuery = {
          'facilityId': this.selelctedFacility._id,
          'minorLocationId': { $in: this.locationIds },
          name: { $regex: value, '$options': 'i' },
        }
      }
    })

    this.getWorkBenches();
    this.getTags();
    this.getInvestigations();
  }

  private _getLoginEmployee(loginEmployee, majorLocationId) {
    if (loginEmployee.workSpaces !== undefined) {
      loginEmployee.workSpaces.forEach(work => {
        work.locations.forEach(loc => {
          if (loc.majorLocationId === majorLocationId) {
            this.locationIds.push(loc.minorLocationId);
          }
        })
      });
    }
  }

  getInvestigations() {
    this.investigationService.find({
      query: {
        'facilityId': this.selelctedFacility._id,
        'LaboratoryWorkbenches.laboratoryId._id': this.checkingObject.typeObject.minorLocationObject._id
        // "LaboratoryWorkbenches": { $elemMatch: { 'laboratoryId._id': this.checkingObject.typeObject.minorLocationObject._id } }
      }
    }).then(res => {
      this.loading = false;
      if (res.data.length > 0) {
        this.investigations = res.data;
      }
    })
  }
  getWorkBenches() {
    this.workbenchService.find({ query: { 'laboratoryId': { $in: this.locationIds } } }).then(res => {
      if (res.data.length > 0) {
        this.workBenches = res.data;
      }
    });
  }
  getTags() {
    this.checkingObject = this.locker.getObject('workbenchCheckingObject');
    if (this.checkingObject.typeObject !== undefined) {
      this.tagService.find({ query: {
        tagType: 'Laboratory Location', name: this.checkingObject.typeObject.minorLocationObject.name }
      }).then(res => {
        if (res.data.length > 0) {
          this.selectedTag = res.data[0];
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

        if (!!this.selectedTag._id) {
          if (item.tagId._id === this.selectedTag._id && item.tagId.tagType === 'Laboratory Location'
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
    if (valid) {
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
          workbenches: [{ workBench: this.selectedWorkBench, price: value.price }],
        }
        this.selectedInvestigation.LaboratoryWorkbenches.push(labCollectionObject);
      } else {
        // is existing
        labCollectionObject = this.selectedInvestigation.LaboratoryWorkbenches[labIndex];
        const index = labCollectionObject.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
        labCollectionObject.workbenches[index].price = value.price;
        // labCollectionObject.workbenches[index].price = this.frmNewPrice.controls['price'].value;
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
        this.pricing_view = false;
        this._systemModuleService.announceSweetProxy('Price has been set/updated successfully!', 'success', null, null, null, null, null, null, null);
      });

      // this.facilityPriceService.update(this.selectedFacilityServicePrice).then(payload => {
      //   this.selectedFacilityServicePrice = payload;
      //   this.frmNewPrice.reset();
      //   this.frmNewPrice.controls['investigation'].reset();
      //   this.frmNewPrice.controls['workbench'].reset();
      // });
    } else {
      this._notification('Error', 'Please fill in all required fields!');
    }
  }

  getLaboratoryMajorLocation(loginEmployee) {
    this._locationService.find({ query: { name: 'Laboratory' } }).then(res => {
      if (res.data.length > 0) {
        this.selectedMajorLocation = res.data[0];
        this._getLoginEmployee(loginEmployee, this.selectedMajorLocation._id);
      }
    })
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
        users: [this.user._id],
        type: type,
        text: text
    });
  }
}

