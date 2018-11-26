import { Component, OnInit } from '@angular/core';
import { StoreService, InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';

@Component({
	selector: 'app-store-home-analytics',
	templateUrl: './store-home-analytics.component.html',
	styleUrls: [ './store-home-analytics.component.scss' ]
})
export class StoreHomeAnalyticsComponent implements OnInit {
	selectedFacility: Facility;
	storeStatistics: any;
	inventoryItemCount: number;
	expiredInventoryItemCount: any;
	expiredStatistics: any;
	aboutToExpiredStatistics: any;
	requireReOrderStatistics: any;
	aboutToExpiredInventoryItemCount: any;
	requireReOrderInventoryItemCount: any;
	outOfStockInventoryItemCount: any;
	transactionInventoryItemCount: any;
	revenueInventoryItemCount: any;
	storeId: any;
	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.getStoreStatistics();
		this.storeId = '5a88a0d26e6d17335cf318bc';
	}

	getStoreStatistics() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this._inventoryService
			.getInventoryBriefStatus(120, {
				query: { storeId: this.storeId, facilityId: this.selectedFacility._id }
			})
			.then(
				(payload) => {
					console.log(payload);
					if (payload.status === 'success' && payload.data.length > 0) {
						this.extractInventoryCountItem(payload.data[0]);
						this.extractExpiredInventoryCountItem(payload.data[1]);
						this.extractAboutToExpiredInventoryCountItem(payload.data[2]);
						this.extractRequireReOrderInventoryCountItem(payload.data[3]);
						this.extractOutOfStockInventoryCountItem(payload.data[4]);
						this.extractTransactionInventoryCountItem(payload.data[5]);
						this.extractRevenueInventoryCountItem(payload.data[6]);
					}
				},
				(error) => {
					console.log(error);
				}
			);
	}
	extractInventoryCountItem(storeStatistics) {
		this.storeStatistics = storeStatistics;
		this.inventoryItemCount = this.storeStatistics.values[0].value;
	}

	extractExpiredInventoryCountItem(expiredStatistics) {
		this.expiredStatistics = expiredStatistics;
		this.expiredInventoryItemCount = expiredStatistics.values[0].value;
	}

	extractAboutToExpiredInventoryCountItem(aboutToExpiredStatistics) {
		this.aboutToExpiredInventoryItemCount = aboutToExpiredStatistics;
		this.aboutToExpiredInventoryItemCount = aboutToExpiredStatistics.values[0].value;
	}

	extractRequireReOrderInventoryCountItem(requireReOrderStatistics) {
		this.requireReOrderInventoryItemCount = requireReOrderStatistics;
		this.requireReOrderInventoryItemCount = requireReOrderStatistics.values[0].value;
	}

	extractOutOfStockInventoryCountItem(outOfStockStatistics) {
		this.outOfStockInventoryItemCount = outOfStockStatistics;
		this.outOfStockInventoryItemCount = outOfStockStatistics.values[0].value;
	}

	extractTransactionInventoryCountItem(transactionStatistics) {
		this.transactionInventoryItemCount = transactionStatistics;
		this.transactionInventoryItemCount = transactionStatistics.values[0].value;
	}

	extractRevenueInventoryCountItem(revenueStatistics) {
		this.revenueInventoryItemCount = revenueStatistics;
		this.revenueInventoryItemCount = revenueStatistics.values[0].value;
	}
}
