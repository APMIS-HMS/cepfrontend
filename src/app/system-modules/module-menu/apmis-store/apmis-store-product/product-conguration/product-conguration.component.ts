//import { FormularyProduct, ProductPackSize } from './../../store-utils/global';
import { ProductService } from './../../../../../services/facility-manager/setup/index';
import { Component, OnInit } from '@angular/core';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-conguration',
  templateUrl: './product-conguration.component.html',
  styleUrls: ['./product-conguration.component.scss']
})
export class ProductCongurationComponent implements OnInit {

 
  constructor() { }

  ngOnInit() {
    // this.storeId = '5a88a0d26e6d17335cf318bc';
    // this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    // this.getInventories();
   
  }

  
}
