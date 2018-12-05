import { ApmisFilterBadgeService } from './../../../../../../services/tools/apmis-filter-badge.service';
import { ProductService } from './../../../../../../services/facility-manager/setup/product.service';
import { FormularyProduct, ProductPackSize, ProductConfig } from './../../../store-utils/global';
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


@Component({
  selector: 'app-config-product',
  templateUrl: './config-product.component.html',
  styleUrls: ['./config-product.component.scss']
})
export class ConfigProductComponent implements OnInit, OnChanges {

  apmisSearch = false;
  showConfigContainer = false;
  showSaveConfig = false;
  showSetBaseUnit = false;
  productExist = false;
  storeId = '';
  searchedProducts: any = [];
  selectedPackSizes = [];
  modifiedPackSizes = [];
  selectedProductName = '';
  selectedProduct: FormularyProduct;
  isBaseUnitSet = false;
  packSizes = [];
  productSearch = new FormControl();
  showProduct = false;
  currentFacility: Facility = <Facility>{};
  baseName = '';
  basePackType: ProductPackSize = <ProductPackSize>{};
  packConfigurations: ProductPackSize[] = [];
  isSaving = false;
  isConfigure = false;
  @Input() editableProductConfigObj;
  @Output() newProductConfig = new EventEmitter();

  constructor(
      private productService: ProductService,
      private locker: CoolLocalStorage,
      private apmisFilterService: ApmisFilterBadgeService,
      private systemModuleService: SystemModuleService
    ) { }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
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
          this.showConfigContainer = false;
          this.showSaveConfig = false;
          this.productExist = false;
          this.isConfigure = false;
      }
      });
      this.getProductPackTypes();
  }
  onShowSearch() {
    this.apmisSearch = !this.apmisSearch;
  }
  setSelectedProductOption(data) {
    this.isConfigure = true;
    this.selectedProduct = data;
    this.getProductConfigByProduct();
    this.selectedProductName = data.name;
    this.showProduct = false;
  }
  onSearchSelectedItems(data) {
    if (data.length > 0) {
      this.setPackSizes(data);
    }
  }
  setPackSizes(data) {
    this.isBaseUnitSet = true;
    this.showConfigContainer = true;
    this.showSaveConfig = false;
    this.showSetBaseUnit = true;
    this.baseName = data[0].label;
    this.basePackType = data[0];
    this.selectedPackSizes = [...data];
    this.packConfigurations = [...data];
    this.packConfigurations.splice(0, 1);
    if (this.packConfigurations.length > 0) { this.showSaveConfig = true; }
  }
  onClickConfigure() {
    if (this.selectedProductName !== '') {
      this.showSetBaseUnit = true;
      this.baseName = '';
    } else {
      this.showSetBaseUnit = false;
      this.showConfigContainer = false;
    }
  }
  ngOnChanges(change: SimpleChanges) {
      if (change['editableProductConfigObj'] !== null) {
        if (this.editableProductConfigObj !== undefined) {
          this.getProductById(this.editableProductConfigObj);
        }
      }
  }
  getProductById(data) {
    const id = data.productId;
      if (id !== '' || id !== undefined) {
        this.productService.get(id, {}).then(payload => {
            if (payload.data.name === undefined) {
                // handle error: show sweet alert to retry fetching again
                this.systemModuleService.announceSweetProxy(
                  'Product: Unable to fetch data. Please try again.',
                  'error', null, null, null, null, null, null, null
                );
                this.showConfigContainer = false;
                this.showSaveConfig = false;
                this.showSetBaseUnit = false;
                this.baseName = '';
            } else {
              this.selectedProduct = payload.data;
              this.selectedProductName = payload.data.name;
              this.transformIncomingPackSizes(data.packSizes);
            }
        }, error => {
        });
      }
  }

  transformIncomingPackSizes(data) {
    const editable = data
    .map(({packId: id, name: label, size: size}) => ({id, label, size}));
    this.setPackSizes(editable);
  }
  onSaveConfiguration() {
    this.isSaving = true;
    if (this.selectedPackSizes[1].size > 1) {
        this.modifyPackSizes(this.selectedPackSizes);
        const newProductConfig: ProductConfig = {
          productId: this.selectedProduct.id,
          facilityId: this.currentFacility._id,
          productObject: this.selectedProduct,
          rxCode: this.selectedProduct.code,
          packSizes: this.modifiedPackSizes
      };
      this.productService.createProductConfig(newProductConfig).then(payload => {
          this.isSaving = false;
          this.systemModuleService.announceSweetProxy(
            'Product: Product configured successfully.',
            'success', null, null, null, null, null, null, null
          );
          this.productService.productConfigAnnounced(payload);
      });
      this.apmisFilterService.clearItemsStorage(true);
    } else {
      this.systemModuleService.announceSweetProxy(
        'Product: Please enter size for product pack.',
        'error', null, null, null, null, null, null, null
      );
      this.apmisFilterService.clearItemsStorage(true);
      this.isSaving = false;
    }
  }

  modifyPackSizes(packs) {
    if (packs.length > 1) {
      const selected = packs.map(({id: packId, label: name, size: size}) => ({packId, name, size}));
        for (let i = 0; i < selected.length; i++) {
            if ( i === 0) {
              selected[i].isBase = true;
              selected[i].size = 1;
              } else { selected[i].isBase = false; }
            this.modifiedPackSizes.push(selected[i]);
        }
        return this.modifiedPackSizes;
    }
  }
  getProductConfigByProduct() {
    this.productService.findProductConfigs({
      query: {
        facilityId: this.currentFacility._id,
        productId: this.selectedProduct.id
      }
    }).then(payload => {
        if (payload.data.length > 0) {
          this.productExist = true;
        }
    });
  }
  getProductPackTypes() {
    this.productService.findPackageSize({
      query: {
        $limit: false
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.packSizes = payload.data.map(({_id: id, name: label}) => ({id, label}));
      }
    });
  }
  onCreateNewItem(item) {
    if (item !== '' || item !== undefined) {
        const newPackSize = {
          name: item
        };
        this.productService.createPackageSize(newPackSize).then(payload => {
            this.getProductPackTypes();
        });
    }
  }
  onClickClose(val) {
    if (!val) {
        this.apmisSearch = !this.apmisSearch;
    }
  }
}
