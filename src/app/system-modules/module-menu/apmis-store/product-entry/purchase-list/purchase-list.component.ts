import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-purchase-list',
  templateUrl: './purchase-list.component.html',
  styleUrls: ['./purchase-list.component.scss']
})
export class PurchaseListComponent implements OnInit {

  purchaseList = true;
  newPurcaseList = false;
  purchaseListDetails = false;
  back_to_purchaseList = false;
  constructor() { }

  ngOnInit() {

  }

backPurchaseList(){
  this.purchaseList = true;
    this.newPurcaseList = false;
    this.purchaseListDetails = false;
    this.back_to_purchaseList = false;
}

  showNewPurchaseList(){
    this.purchaseList = false;
    this.newPurcaseList = true;
    this.purchaseListDetails = false;
    this.back_to_purchaseList = true;
  }

  showPurchaseListDetail(){
    this.purchaseList = false;
    this.newPurcaseList = false;
    this.purchaseListDetails = true;
    this.back_to_purchaseList = true;
  }

}
