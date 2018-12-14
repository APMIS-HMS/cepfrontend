import { ProductType } from './../../../../store-utils/global';
import { ProductObserverService } from './../../../../../../../services/tools/product-observer.service';
import { ProductService } from './../../../../../../../services/facility-manager/setup/product.service';
import { Component, OnInit, Input, OnDestroy} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { StoreProduct } from 'app/system-modules/module-menu/apmis-store/store-utils/global';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-drug-entry',
  templateUrl: './drug-entry.component.html',
  styleUrls: ['./drug-entry.component.scss']
})
export class DrugEntryComponent implements OnInit, OnDestroy {
  drugSearch = new FormControl();
  drugProducts: any = [];
  selectedDrugName = '';
  selectedDrug: StoreProduct = <StoreProduct>{};
  showProduct = false;
  configProductBtn = '';
  @Input() drugExist: boolean;
  @Input() canConfigure = false;
  productNameSubscription: Subscription;
  currentFacility: Facility = <Facility>{};
  constructor(private productService: ProductService,
        private pdObserverService: ProductObserverService,
        private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.drugSearch.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
        if (this.drugSearch.value.length >= 3) {
          this.productService.find({
            query: {
              name: val
            }
          }).then(payload => {
            this.drugProducts = payload.data;
            if (this.drugProducts.length > 0) {
              this.showProduct = true;
            }
          });
        } else if (this.drugSearch.value.length < 1) {
          this.canConfigure = false;
          this.drugExist = false;
          this.pdObserverService.setBaseUnitState(false);
          this.pdObserverService.setConfigContainerState(false);
        }
    });
    this.productNameSubscription = this.pdObserverService.productNameChanged.subscribe(name => {
        this.drugSearch.setValue(name);
    });
  }
  setSelectedProduct(option) {
    this.selectedDrug.type = ProductType.Drugs;
    this.selectedDrug = option;
    this.selectedDrugName = option.name;
    this.showProduct = false;
    this.getDrugConfigById(this.selectedDrug.id);
  }
  private getDrugConfigById(id) {
    this.productService.findProductConfigs({
      query: {
        facilityId: this.currentFacility._id,
        productId: id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.drugExist = true;
        this.canConfigure = false;
      } else {
        this.drugExist = false;
        this.canConfigure = true;
      }
    });
  }
  onClickConfigure() {
    if (this.selectedDrugName !== '' || this.selectedDrugName !== undefined) {
      this.configProductBtn = 'Save Configuration';
      this.pdObserverService.setBaseUnitState(true);
    } else {
      this.pdObserverService.setBaseUnitState(false);
    }
  }
  ngOnDestroy() {
    if (this.productNameSubscription !== null) {
      this.productNameSubscription.unsubscribe();
    }
  }
}
