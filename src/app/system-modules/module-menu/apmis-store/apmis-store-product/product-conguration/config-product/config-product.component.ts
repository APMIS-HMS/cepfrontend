import { FormularyProduct, ProductPackSize } from './../../../store-utils/global';
import { ProductService } from './../../../../../../services/facility-manager/setup/index';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-config-product',
  templateUrl: './config-product.component.html',
  styleUrls: ['./config-product.component.scss']
})
export class ConfigProductComponent implements OnInit, OnDestroy {

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
  subscription: Subscription;
  packClickSubscription: Subscription;
  baseName = '';
  basePackType: ProductPackSize = <ProductPackSize>{};
  packConfigurations: ProductPackSize[] = [];

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
      this.subscription = this.productService.getSelectedProductPackSize().subscribe((data: ProductPackSize[]) => {
          const packSizes = data;
          if (packSizes.length > 0) {
            this.isBaseUnitSet = true;
            this.showConfigContainer = true;
            // TODO: Send base name from parent to child component
            this.baseName = packSizes[0].name;
            this.basePackType = packSizes[0];
            this.packConfigurations = [...packSizes];
            this.packConfigurations.splice(0, 1);

            this.packSizes = this.packConfigurations;
          }
      });
  }
  onShowSearch() {
    this.apmisSearch = !this.apmisSearch;
    const selectState = this.apmisSearch ? 'open' : 'close';
    this.productService.sendPackSizeViewState(selectState);
    this.getProductPackTypes();
    //console.log(this.productService.sendPackSizeViewState(this.apmisSearch));
    // if (this.apmisSearch) {
    //     const state = this.apmisSearch;
    //   this.productService.sendPackSizeViewState(state);
    // } else {
    //   this.productService.sendPackSizeViewState(false);
    // }
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
  ngOnDestroy() {
    if (this.subscription !== null) {
      this.subscription.unsubscribe();
    }
  }
}
