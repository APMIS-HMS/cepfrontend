import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-new-purchase-order-list',
	templateUrl: './new-purchase-order-list.component.html',
	styleUrls: [ './new-purchase-order-list.component.scss' ]
})
export class NewPurchaseOrderListComponent implements OnInit {
	storeFilters = [];
	selectedFilterIndex = 0;
	filterType = '';
	currentDate: FormControl;
	constructor(private storeUtilService: StoreGlobalUtilService) {}

	ngOnInit() {
		this.currentDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
	}

	setSelectedFilter(index, filter) {
		this.selectedFilterIndex = index;
		this.filterType = filter;
		//console.log(this.filterText);
	}
}
