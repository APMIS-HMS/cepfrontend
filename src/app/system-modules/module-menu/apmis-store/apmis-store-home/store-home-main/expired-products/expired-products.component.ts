import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-expired-products',
  templateUrl: './expired-products.component.html',
  styleUrls: ['./expired-products.component.scss']
})
export class ExpiredProductsComponent implements OnInit {

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
