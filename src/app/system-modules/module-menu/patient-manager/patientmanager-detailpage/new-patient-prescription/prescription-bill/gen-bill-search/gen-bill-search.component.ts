import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-gen-bill-search',
	templateUrl: './gen-bill-search.component.html',
	styleUrls: [ './gen-bill-search.component.scss' ]
})
export class GenBillSearchComponent implements OnInit {
	@Input() drugs = [];
	@Input() stores = [];
	@Input() selectedDrug;
	@Output() searchResultEvent: EventEmitter<any> = new EventEmitter<any>();
	selectedFacility: any;
	selectedStore: any;
	drugPicked: any;
	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
	}

	getDrugList() {
		this.drugs = [];
		this._inventoryService
			.findList({
				query: {
					code: this.selectedDrug.code,
					facilityId: this.selectedFacility._id,
					storeId: this.selectedStore.storeId
				}
			})
			.then((res) => {
				this.drugs = res.data;
				this.searchResultEvent.emit({ drugs: this.drugs, selectedStore: this.selectedStore });
			})
			.catch((err) => {
				console.log(err);
			});
	}
	selectStore(store) {
		this.selectedStore = store;
		this.getDrugList();
	}

	onItemChange(drug) {
		this.drugPicked = drug;
		console.log(this.drugPicked);
	}
}
