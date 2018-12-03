import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';


@Component({
  selector: 'app-new-purchase-order-list',
  templateUrl: './new-purchase-order-list.component.html',
  styleUrls: ['./new-purchase-order-list.component.scss']
})
export class NewPurchaseOrderListComponent implements OnInit {


  storeFilters = [];
  selectedFilterIndex = 0;
  filterType = '';

  constructor(private storeUtilService: StoreGlobalUtilService) { }

  ngOnInit() {
    this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
  }

  setSelectedFilter(index, filter) {
    this.selectedFilterIndex = index;
    this.filterType = filter;
    //console.log(this.filterText);
  }
}
