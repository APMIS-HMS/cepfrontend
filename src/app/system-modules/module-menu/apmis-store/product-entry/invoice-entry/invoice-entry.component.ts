import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../store-utils/global-service';
import { Filters } from '../../store-utils/global';

@Component({
  selector: 'app-invoice-entry',
  templateUrl: './invoice-entry.component.html',
  styleUrls: ['./invoice-entry.component.scss']
})
export class InvoiceEntryComponent implements OnInit {

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
