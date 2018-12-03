import { Component, OnInit } from '@angular/core';
import { ProductService } from 'app/services/facility-manager/setup/product.service';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-product-conguration',
  templateUrl: './product-conguration.component.html',
  styleUrls: ['./product-conguration.component.scss']
})
export class ProductCongurationComponent implements OnInit {
  currentFacility: Facility = <Facility>{};
  productConfigs = [];
  baseUnit = '';
  constructor(private productService: ProductService,
      private locker: CoolLocalStorage) { }
  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getProductConfigsByFacility();
  }

  getProductConfigsByFacility() {
    console.log(this.currentFacility._id);
    this.productService.findProductConfigs({
      query: {
        $limit: false,
        facilityId: this.currentFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.productConfigs = payload.data;
        this.productConfigs.forEach(x => {
            x.baseUnit = x.packSizes.filter(y => y.isBase);
        });
      }
    });
  }

}
