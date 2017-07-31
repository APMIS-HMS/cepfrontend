import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { FacilitiesServiceCategoryService, ServicePriceService } from '../../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, FacilityServicePrice } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-new-price',
  templateUrl: './new-price.component.html',
  styleUrls: ['./new-price.component.scss']
})
export class NewPriceComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  isPrice = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';
  categories: FacilityService[] = [];
  selectedCategory: FacilityService = <FacilityService>{};
  services: CustomCategory[] = [];
  facility: Facility = <Facility>{};
  public frmNewprice: FormGroup;

  constructor(private formBuilder: FormBuilder, private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private _locker: CoolSessionStorage, private servicePriceService: ServicePriceService) {
  }

  ngOnInit() {
    this.addNew();
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.getCategories();

    this.frmNewprice.controls['serviceCat'].valueChanges.subscribe(value => {
      this.filterServices(value);
      this.selectedCategory = value;
    });
  }
  addNew() {
    this.frmNewprice = this.formBuilder.group({
      serviceCat: ['', [<any>Validators.required]],
      service: ['', [<any>Validators.required]],
      price: new FormArray([])
      //price: [0.00, [<any>Validators.required]]
    });
  }
  filterServices(itemj) {
    this.services = [];
    itemj.services.forEach((itemk, k) => {
      const customCategory: CustomCategory = <CustomCategory>{};
      customCategory.service = itemk.name;
      customCategory.serviceId = itemk._id;
      customCategory.facilityServiceId = itemj.facilityServiceId;
      customCategory.category = itemj.name;
      customCategory.serviceCode = itemk.code;
      this.services.push(customCategory);
    });
  }
  getCategories() {
    this._facilitiesServiceCategoryService.find({
      query: {
        $or: [
          { facilityId: this.facility._id },
          { facilityId: undefined }
        ]
      }
    })
      .then(payload => {
        this.categories = [];
        this.services = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              itemj.facilityServiceId = itemi._id;
              this.categories.push(itemj);
            }
          });
        });
      });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  newPrice(value: any, valid: boolean) {
    console.log(value);
    // return;
    const price: FacilityServicePrice = <FacilityServicePrice>{};
    price.categoryId = value.serviceCat._id;
    price.facilityId = this.facility._id;
    price.serviceId = value.service.serviceId;
    price.facilityServiceId = value.service.facilityServiceId;
    price.price = value.price;
    this.servicePriceService.create(price).then(payload => {
      this.addNew();
      this.frmNewprice.controls['serviceCat'].valueChanges.subscribe(newValue => {
        this.filterServices(newValue);
        this.selectedCategory = newValue;
      });
    });
  }

  showPrice() {
    this.isPrice = true;
  }
  buildPrice(){

  }

}
