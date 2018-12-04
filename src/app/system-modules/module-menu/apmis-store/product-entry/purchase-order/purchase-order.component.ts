import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {


  purchaseOrderList = true;
  newPurcaseOrderList = false;
  purchaseOrderListDetails = false;
  back_to_purchaseOrderList = false;
  constructor() { }

  ngOnInit() {
  }

  backPurchaseOrderList(){
    this.purchaseOrderList = true;
      this.newPurcaseOrderList = false;
      this.purchaseOrderListDetails = false;
      this.back_to_purchaseOrderList = false;
  }
  
    showNewPurchaseOrderList(){
      this.purchaseOrderList = false;
      this.newPurcaseOrderList = true;
      this.purchaseOrderListDetails = false;
      this.back_to_purchaseOrderList = true;
    }
  
    showPurchaseOrderListDetail(){
      this.purchaseOrderList = false;
      this.newPurcaseOrderList = false;
      this.purchaseOrderListDetails = true;
      this.back_to_purchaseOrderList = true;
    }
  
}
