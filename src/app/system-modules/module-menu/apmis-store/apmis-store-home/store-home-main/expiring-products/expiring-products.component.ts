import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expiring-products',
  templateUrl: './expiring-products.component.html',
  styleUrls: ['./expiring-products.component.scss']
})
export class ExpiringProductsComponent implements OnInit {

  clickItemIndex: number;
  expand_row = false;
  people: any[] = [
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"},
    {firstname: "Ikechukwu"}
  ];

  constructor() { }

  ngOnInit() {
  }

  item_to_show(i) {
    if(this.expand_row){
      return this.clickItemIndex === i; 
    }
  } 
  toggle_tr(itemIndex){
    this.clickItemIndex = itemIndex;
    this.expand_row = !this.expand_row;
  }

}
