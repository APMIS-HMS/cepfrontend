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

	constructor(private _inventoryService: InventoryService) {}

	ngOnInit() {
		console.log(this.drug);
		this._inventoryService
			.find({
				query: {
					'productObject.code': this.drug.code
				}
			})
			.then(
				(payload) => {
					console.log(payload);
				},
				(error) => {
					console.log(error);
				}
			);
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
