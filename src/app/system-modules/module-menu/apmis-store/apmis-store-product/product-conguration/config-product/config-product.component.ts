import { FormularyProduct, ProductPackSize } from './../../../store-utils/global';
import { ProductService } from './../../../../../../services/facility-manager/setup/index';
import { Component, OnInit } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-config-product',
  templateUrl: './config-product.component.html',
  styleUrls: ['./config-product.component.scss']
})
export class ConfigProductComponent implements OnInit {

  apmisSearch = false;
  showConfigContainer = false;
  showSetBaseUnit = false;
  storeId = '';
  searchedProducts: any = [];
  selectedProductName = '';
  isBaseUnitSet = false;
  packSizes: ProductPackSize[] = [];
  productSearch = new FormControl();
  showProduct = false;
  currentFacility: Facility = <Facility>{};

  constructor(
      private productService: ProductService,
      private locker: CoolLocalStorage
    ) { }

  ngOnInit() { 
    this.productSearch.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
    if (this.productSearch.value.length >= 3) {
      // get searched product from formulary
        this.productService.find({
          query: {
            name: val
          }
        }).then(payload => {
          this.searchedProducts = payload.data;
          if (this.searchedProducts.length > 0) {
            this.showProduct = true;
          }
        });
    } else if (this.productSearch.value.length < 1) {
        this.showProduct = false;
        this.showSetBaseUnit = false;
        this.selectedProductName = '';
    }
});
  }
  onShowSearch() {
    this.apmisSearch = !this.apmisSearch;
    this.getProductPackTypes();
  }
  setSelectedOption(data: FormularyProduct) {
    this.selectedProductName = data.name;
    this.showProduct = false;
  }
  onClickConfigure() {
    if (this.selectedProductName !== '') {
      this.showSetBaseUnit = true;
    } else {
      this.showSetBaseUnit = false;
    }
  }
  getProductPackTypes() {
    this.productService.findPackageSize({
      query: {
        $limit: false
      }
    }).then(payload => {
      this.packSizes = payload.data;
    });
  }
  getInventories() {
    // this.inventoryService
    // .findFacilityProductList({
    //   query: { facilityId: this.currentFacility._id, storeId: this.storeId }
    // })
    // .then(
    //   (payload) => {
    //     this.products = payload.data;
    //     console.log(this.products);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

}
