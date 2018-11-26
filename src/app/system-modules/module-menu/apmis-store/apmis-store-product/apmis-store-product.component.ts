import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-apmis-store-product',
  templateUrl: './apmis-store-product.component.html',
  styleUrls: ['./apmis-store-product.component.scss']
})
export class ApmisStoreProductComponent implements OnInit {

  
  showAdjustStock = false;
  tab_all_products = true;
  tab_product_config = false;
  constructor() { }

  ngOnInit() {
  }
  tab_click(tab){
    if(tab==='products'){
      this.tab_all_products = !this.tab_all_products;
      this.tab_product_config = false;
    } else if(tab==='productConfig'){
      this.tab_all_products = false;
      this.tab_product_config = !this.tab_product_config;
    }  
  }

  
}


