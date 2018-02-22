import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, FacilityService, ServiceCategory, ServiceItem } from '../../../../../models/index';
import { FormControl } from '@angular/forms';
import { FacilitiesServiceCategoryService, ServiceDictionaryService } from '../../../../../services/facility-manager/setup/index';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';


@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {
  frmNewservice: FormGroup;
  addPanelFormGroup: FormGroup;
  panelNameControl = new FormControl();
  costControl = new FormControl();

  facility: Facility = <Facility>{};
  categories: FacilityService[] = [];
  allServiceItems: any = <any>[];
  dictionaries: any[] = [];
  panelItems: any[] = [];
  showPanel = false;
  showServelLayout = true;
  selectedServiceItems: any[] = [];
  priceItems: any[] = [];
  panelSearchControl = new FormControl();
  editPriceControl = new FormControl();
  newPanel = new FormControl();
  isDisableBtn = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshService: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedService: any;
  @Input() selectedCategory: any;
  serviceItemModel: ServiceItem = <ServiceItem>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  btnTitle = 'CREATE SERVICE';
  btnPanel = 'ADD PANEL';

  constructor(private formBuilder: FormBuilder, private _locker: CoolLocalStorage,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private serviceDictionaryService: ServiceDictionaryService,
    private systemModuleService: SystemModuleService) {

  }

  ngOnInit() {
    this.btnTitle = 'CREATE SERVICE';
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.addNew();
    this.allServices();
    this.onEditService();

    const subscribeForServiceDictionary = this.frmNewservice.controls['serviceName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        this.serviceDictionaryService.find({
          query:
            { word: { $regex: this.frmNewservice.controls['serviceName'].value, '$options': 'i' } }
        }).
          then(payload => {
            if (this.frmNewservice.controls['serviceName'].value.length === 0) {
              this.dictionaries = [];
            } else {
              this.dictionaries = payload.data;
            }

          })
      });


    this.panelSearchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        this.allServiceItems = [];
        this.systemModuleService.on();
        this._facilitiesServiceCategoryService.allServices({
          query:
            {
              facilityId: this.facility._id,
              isQueryService: true,
              searchString: value
            }
        }).then(payload => {
          this.systemModuleService.off();
          this.panelItemTemplate(payload);
        })
      });

    this.getCategories();
    this.frmNewservice.controls['isPanel'].valueChanges.subscribe(value => {
      if (value) {
        this.showServelLayout = false;
        this.showPanel = true;
      } else {
        this.showServelLayout = true;
        this.showPanel = false;
      }
    });
  }

  onCheckPanelItem(event, item, index) {
    if (event.srcElement.checked) {
      this.selectedServiceItems.push(item);
    } else {
      this.selectedServiceItems.splice(index, 1);
    }
  }

  compareCategory(l1: any, l2: any) {
    return l1.includes(l2);
  }

  onEditService() {
    console.log(this.selectedService);
    if (this.selectedService.name !== undefined) {
      this.btnTitle = 'Update Service';
      console.log(this.selectedService);
      this.frmNewservice.controls['serviceName'].setValue(this.selectedService.name);
      this.frmNewservice.controls['serviceCat'].setValue(this.selectedService.categoryId);
      this.frmNewservice.controls['serviceCode'].setValue(this.selectedService.code);
      let basedPrice = this.selectedService.price.filter(x => x.isBase === true)[0];
      this.frmNewservice.controls['servicePrice'].setValue(basedPrice.price);
      this.priceItems = JSON.parse(JSON.stringify(this.selectedService.price));
      if (this.selectedService.panels !== undefined) {
        if (this.selectedService.panels.length > 0) {
          this.btnPanel = 'UPDATE PANEL';
          this.panelNameControl.setValue(this.selectedService.name);
          this.costControl.setValue(basedPrice.price);
        }
      }
      this.selectedService.panels
    }
    this.frmNewservice.controls['serviceCat'].setValue(this.selectedService.categoryId);
  }

  getCategories() {
    this._facilitiesServiceCategoryService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      if (payload.data.length > 0) {
        this.categories = payload.data[0].categories;
      }
    });
  }
  addNew() {
    this.frmNewservice = this.formBuilder.group({
      serviceName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      serviceCat: ['', [<any>Validators.required]],
      serviceAutoCode: ['', []],
      serviceCode: ['', []],
      servicePrice: ['', []],
      isPanel: [false]
    });

    this.addPanelFormGroup = this.formBuilder.group({
      panelService: ['', [<any>Validators.required]]
    });
  }
  onSelectDictionary(dic: any) {
    this.frmNewservice.controls['serviceName'].setValue(dic.word);
  }

  addPanel() {
    let value = {
      name: this.panelNameControl.value,
      price: this.costControl.value,
      facilityId: this.facility._id,
      categoryId: this.selectedCategory._id,
      isCategory: false
    }
    this.onCreate(value);
  }

  allServices() {
    this.systemModuleService.on();
    console.log(this.facility._id);
    this._facilitiesServiceCategoryService.allServices({
      query: {
        facilityId: this.facility._id
      }
    }).then(payload => {
      this.systemModuleService.off();
      console.log(payload);
      this.panelItemTemplate(payload);
    }, error => {
      this.systemModuleService.off();
    });
  }

  panelItemTemplate(payload) {
    this.allServiceItems = [];
    if (payload.data[0].categories.length > 0) {
      console.log(1);
      let len = payload.data[0].categories.length - 1;
      console.log(2);
      for (let l = 0; l <= len; l++) {
        console.log(3);
        if (payload.data[0].categories[l].services.length > 0) {
          console.log(4);
          let len2 = payload.data[0].categories[l].services.length - 1;
          console.log(5);
          for (let i = 0; i <= len2; i++) {
            console.log(6);
            this.allServiceItems.push({
              category: payload.data[0].categories[l].name,
              categoryId: payload.data[0].categories[l]._id,
              service: payload.data[0].categories[l].services[i].name,
              serviceId: payload.data[0].categories[l].services[i]._id,
              price: payload.data[0].categories[l].services[i].price,
              checked: false
            });
            if (this.selectedService.panels !== undefined) {
              if (this.selectedService.panels.length > 0) {
                console.log(7);
                let len3 = this.selectedService.panels.length - 1;
                console.log(8);
                for (let j = 0; j <= len3; j++) {
                  let index4 = this.allServiceItems.filter(x => x.categoryId.toString() === this.selectedService.panels[j].categoryId.toString()
                    && x.serviceId.toString() === this.selectedService.panels[j].serviceId.toString());
                  if (index4.length > 0) {
                    index4[0].checked = true;
                  }
                }
              }
            }

          }
        }

      }
      console.log(this.allServiceItems);
      let sort = this.allServiceItems.sort(function (a, b) {
        var checked = a.checked, unchecked = b.checked;
        if (checked < unchecked)
          return 1;
        if (checked > unchecked)
          return -1;
        return 0;

      })
      this.allServiceItems = sort;
      this.selectedServiceItems = this.allServiceItems.filter(x => x.checked === true);
    }
  }

  newService(model: any, valid: boolean) {
    console.log(this.frmNewservice.controls);
    console.log(this.frmNewservice.controls['serviceCat'].value);
    if (valid) {
      let value = {
        name: this.frmNewservice.controls['serviceName'].value,
        code: this.frmNewservice.controls['serviceCode'].value,
        categoryId: this.frmNewservice.controls['serviceCat'].value,
        isCategory: false,
        price: this.frmNewservice.controls['servicePrice'].value

      }
      this.onCreate(value);
    }
  }

  onCreate(data) {
    this.systemModuleService.on();
    this.isDisableBtn = true;
    console.log(this.selectedService);
    if (this.selectedService.name === undefined) {
      data.panels = this.selectedServiceItems;
      this._facilitiesServiceCategoryService.create(data, {
        query: {
          facilityId: this.facility._id,
          isCategory: data.isCategory,
          categoryId: data.categoryId
        }
      }).then(payload => {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Service added successful', 'success');
        this.isDisableBtn = false;
        this.frmNewservice.reset();
        this.refreshService.emit(this.selectedService);
      }, error => {
        console.log(error);
        this.isDisableBtn = false;
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Failed to add Service', 'error');
      });
    } else {
      console.log(data.code);
      this.serviceItemModel.code = data.code;
      this.serviceItemModel._id = this.selectedService._id;
      this.serviceItemModel.name = data.name;
      this.serviceItemModel.panels = this.selectedServiceItems;
      this.serviceItemModel.price = {};
      this.serviceItemModel.price.base = this.priceItems.filter(x => x.isBase === true)[0];
      this.serviceItemModel.price.base.price = data.price;
      console.log(this.priceItems);
      if (this.selectedService.price != undefined) {
        if (this.selectedService.price.length > 0) {
          this.serviceItemModel.price.others = this.priceItems.filter(x => x.isBase === false);
        }
      }
      console.log(this.serviceItemModel);
      this._facilitiesServiceCategoryService.update2(this.facility._id, this.serviceItemModel, {
        query: {
          facilityId: this.facility._id,
          isCategory: false,
          serviceId: this.selectedService._id,
          categoryId: this.selectedCategory._id,
          name: data.name
        }
      }).then(payload => {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Service added successful', 'success');
        this.isDisableBtn = false;
        this.refreshService.emit(this.selectedService);
        this.frmNewservice.reset();
        this.close_onClick();
      }, error => {
        console.log(error);
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Failed to add service', 'error');
        this.isDisableBtn = false;
      });
    }
  }

  onEditPrice(event, i) {
    this.priceItems[i].price = event.srcElement.value;
  }

  onClickAddToPanel() {

  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  onClickShowPanel() {
    this.showPanel = !this.showPanel;
    this.showServelLayout = false;
  }

}
