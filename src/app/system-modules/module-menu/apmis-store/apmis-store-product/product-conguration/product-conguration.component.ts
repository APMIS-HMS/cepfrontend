import { ArrayFunctionHelper } from './../../../../../shared-module/helpers/array-function-helper';
import { Component, OnInit } from '@angular/core';
import { ProductService } from './../../../../../services/facility-manager/setup/product.service';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


@Component({
  selector: 'app-product-conguration',
  templateUrl: './product-conguration.component.html',
  styleUrls: ['./product-conguration.component.scss']
})
export class ProductCongurationComponent implements OnInit {
  currentFacility: Facility = <Facility>{};
  productConfigs = [];
  baseUnit = '';
  selectedProductConfig;
  productConfigLoading = true;
  configToDelete: any = <any>{};
  
  constructor(private productService: ProductService,
    private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage) { }
  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getProductConfigsByFacility();

    this.productService.productConfigRecieved().subscribe(payload => {
        this.productConfigs.push(payload);
        const index = this.productConfigs.length - 1;
        this.productConfigs[index].baseUnit = payload.packSizes.filter(y => y.isBase);
    });
    this.productService.productConfigUpdateRecieved().subscribe(payload => {
      if (payload) {
        this.getProductConfigsByFacility();
      }
    }, err => {
    });
  }
  onEdit(data) {
    this.selectedProductConfig = data;
  }
  getProductConfigsByFacility() {
    this.productService.findProductConfigs({
      query: {
        $limit: false,
        facilityId: this.currentFacility._id
      }
    }).then(payload => {
      this.productConfigLoading = false;
      if (payload.data.length > 0) {
        this.productConfigs = payload.data;
        this.productConfigs.forEach(x => {
            x.baseUnit = x.packSizes.filter(y => y.isBase);
        });
        // calling reverse on array to display most recent record in array
        // this.reverseArray(this.productConfigs);
      }
    });
  }
  confirmDelete(data) {
    console.log(data);
    this.configToDelete = data;
		this.configToDelete.acceptFunction = true;
    this.systemModuleService.announceSweetProxy(`You are about to delete configuration for
                  : '${data.productObject.name}'`, 'question', this);

  }
  sweetAlertCallback(result) {
		if (result.value) {
		  if (this.configToDelete.acceptFunction === true) {
				// proceed with the delete action after user has confirmed
				this.deleteProductConfiguration(true);
		  } else {
				this.deleteProductConfiguration(false);
		  }
			}
    }
  deleteProductConfiguration(isProceed: boolean) {
      if (isProceed) {
        this.productService.removeProductConfig(this.configToDelete._id, {}).then(payload => {
             this.getProductConfigsByFacility();
        });
      }
  }
}
