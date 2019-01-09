import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { InventoryService } from 'app/services/facility-manager/setup';

@Component({
	selector: 'app-prescription-bill',
	templateUrl: './prescription-bill.component.html',
	styleUrls: [ './prescription-bill.component.scss' ]
})
export class PrescriptionBillComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() drug: any;

	productAvailable = true;
	searchProduct = false;
	searchShow = false;
	searchList = true;
	drugs: any[] = [];

	constructor(private _inventoryService: InventoryService) {}

	ngOnInit() {
		this.getDrugList();
	}

	getDrugList() {
		// query: { facilityId: this.facility._id, name: this.title, storeId: this.storeId }
		this._inventoryService
			.findList({
				query: { code: this.drug.code }
			})
			.then((res) => {
				console.log(res);
				this.drugs = res.data;
			})
			.catch((err) => {
				console.log(err);
			});
	}

	onClickClose(e) {
		this.closeModal.emit(true);
	}

	onShowSearchResult() {
		this.searchShow = true;
		this.searchList = false;
	}
	onClickPrd() {
		this.productAvailable = !this.productAvailable;
		this.searchProduct = true;
	}
}
