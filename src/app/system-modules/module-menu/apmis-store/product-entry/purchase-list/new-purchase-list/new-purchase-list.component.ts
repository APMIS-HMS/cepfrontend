import { TagService } from './../../../../../../services/facility-manager/setup/tag.service';
import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee } from 'app/models';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { EmployeeService, ProductService } from 'app/services/facility-manager/setup';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-new-purchase-list',
	templateUrl: './new-purchase-list.component.html',
	styleUrls: [ './new-purchase-list.component.scss' ]
})
export class NewPurchaseListComponent implements OnInit {
	storeFilters = [];
	selectedFilterIndex = 0;
	filterType = '';
	selectedFacility: any;
	storeId: string;
	products: any;
	numberOfPages: number;
	limit: any;
	total: any;
	skip: any;
	subscription: any;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	productConfigSearch: FormControl = new FormControl();
	selectedProductName: any;
	showProduct: boolean;
	searchHasBeenDone = false;
	selectedProduct: any;
	productConfigs: any[] = [];
	selectedProducts: any[] = [];

	constructor(
		private storeUtilService: StoreGlobalUtilService,
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private _productService: ProductService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this._locker.setObject('checkingObject', this.checkingStore);
					}
				}
			}
		});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
				// this.modal_on = true;
			} else {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						let checkingObject = { typeObject: itemr, type: 'store' };
						this._employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
								checkingObject = { typeObject: itemr, type: 'store' };
								this._employeeService.announceCheckIn(checkingObject);
								this._locker.setObject('checkingObject', checkingObject);
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this._employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload) => {
									this.loginEmployee = payload;
									const checkingObject = { typeObject: itemr, type: 'store' };
									this._employeeService.announceCheckIn(checkingObject);
									this._locker.setObject('checkingObject', checkingObject);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this.checkingStore = (<any>this._locker.getObject('checkingObject')).typeObject;
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');

		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this.selectedProduct = undefined;
				this.selectedProductName = '';
				this.getInventoryList(value);
			} else {
				this.selectedProductName = '';
			}
		});
		this.getInventoryList();
	}

	getInventoryList(searchText?) {
		if (searchText) {
			this._inventoryService
				.findFacilityProductList({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						limit: this.limit,
						skip: this.skip * this.limit,
						searchText: searchText
					}
				})
				.then(
					(payload) => {
						this.productConfigs = this.modifyProducts(payload.data);
						this.numberOfPages = payload.total / this.limit;
						this.total = payload.total;
					},
					(error) => {}
				);
		} else {
			this._inventoryService
				.findFacilityProductList({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						limit: this.limit,
						skip: this.skip * this.limit
					}
				})
				.then(
					(payload) => {
						this.productConfigs = this.modifyProducts(payload.data);
						this.numberOfPages = payload.total / this.limit;
						this.total = payload.total;
					},
					(error) => {}
				);
		}
	}

	modifyProducts(configs: any[]) {
		return configs.map((config) => {
			config.isChecked = this.validateAgainstDuplicateProductEntry(config) ? false : true;
			return config;
		});
	}
	setSelectedFilter(index, filter) {
		this.selectedFilterIndex = index;
		this.filterType = filter;
		if (this.filterType === 'All') {
			this.getInventoryList();
		}
	}

	setSelectedOption(event, data: any) {
		if (event.target.checked && this.validateAgainstDuplicateProductEntry(data)) {
			this.selectedProducts.push(data);
		} else if (!event.target.checked) {
			const selectedIndex = this.selectedProducts.findIndex((x) => x.productId.toString() === data.productId);
			if (selectedIndex > -1) {
				this.selectedProducts.splice(selectedIndex, 1);
			}
		}
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = this.selectedProducts.find((x) => x.productId.toString() === product.productId.toString());
		return result === undefined ? true : false;
	}

	onFocus(focus) {
		if (focus === 'in') {
			this.selectedProductName = '';
			this.showProduct = true;
		} else {
			setTimeout(() => {
				this.showProduct = false;
			}, 300);
		}
	}
}
