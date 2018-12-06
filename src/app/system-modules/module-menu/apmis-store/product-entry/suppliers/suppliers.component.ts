import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'app/services/facility-manager/setup';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-suppliers',
	templateUrl: './suppliers.component.html',
	styleUrls: [ './suppliers.component.scss' ]
})
export class SuppliersComponent implements OnInit {
	showViewInvoice = false;
	showNewSupplier = false;
	main_content = true;
	selectedFacility: any;
	suppliers: any[] = [];

	constructor(private supplierService: SupplierService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getSuppliers();
	}

	getSuppliers() {
		this.supplierService
			.find({
				query: {
					facilityId: this.selectedFacility._id
				}
			})
			.then(
				(payload) => {
					console.log(payload);
					this.suppliers = payload.data.map((c) => {
						return { id: c._id, label: c.supplier.name };
					});
					console.log(this.suppliers);
				},
				(error) => {}
			);
	}

	close_onClick(e) {
		this.showViewInvoice = false;
	}

	viewInvoice() {
		this.showViewInvoice = true;
	}

	onShowNewSupplier() {
		this.showNewSupplier = true;
		this.main_content = false;
	}

	onSearchSelectedItems(data) {
		if (data.length > 0) {
			// this.isBaseUnitSet = true;
			// this.showConfigContainer = true;
			// this.showSaveConfig = false;
			// // TODO: Send base name from parent to child component
			// this.baseName = data[0].label;
			// this.basePackType = data[0];
			// this.selectedPackSizes = [...data];
			// this.packConfigurations = [...data];
			// this.packConfigurations.splice(0, 1);
			// if (this.packConfigurations.length > 0) { this.showSaveConfig = true; }
		}
	}

	onCreateNewItem(item) {
		if (item !== '' || item !== undefined) {
			const newPackSize = {
				name: item
			};
			// this.productService.createPackageSize(newPackSize).then(payload => {
			//   this.getProductPackTypes();
			// });
		}
	}
}
