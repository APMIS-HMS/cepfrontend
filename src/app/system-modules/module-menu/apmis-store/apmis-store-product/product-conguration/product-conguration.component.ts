import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-conguration',
  templateUrl: './product-conguration.component.html',
  styleUrls: ['./product-conguration.component.scss']
})
export class ProductCongurationComponent implements OnInit {

  apmisSearch = false;
  constructor() { }

  ngOnInit() {
  }

  onShowSearch(){
    this.apmisSearch = !this.apmisSearch;
  }
}
