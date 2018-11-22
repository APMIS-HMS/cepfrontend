import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.scss']
})
export class AllProductsComponent implements OnInit {

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
