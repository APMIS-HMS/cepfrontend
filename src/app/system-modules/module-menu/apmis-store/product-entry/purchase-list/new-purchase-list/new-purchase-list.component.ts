import { TagService } from './../../../../../../services/facility-manager/setup/tag.service';
import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee } from 'app/models';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import {
	EmployeeService,
	ProductService,
	SupplierService,
	PurchaseOrderService
} from 'app/services/facility-manager/setup';
import { FormControl } from '@angular/forms';
import { ApmisFilterBadgeService } from 'app/services/tools';
import { PurchaseOrder, PurchaseList, ListedItem } from '../../../components/models/purchaseorder';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-new-purchase-list',
	templateUrl: './new-purchase-list.component.html',
	styleUrls: [ './new-purchase-list.component.scss' ]
})
export class NewPurchaseListComponent implements OnInit {
	sup_search = false;
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
	suppliers: any[] = [];
	selectedSuppliers: any[] = [];
	selectedLocalStorageSuppliers: any[] = [];
	supplierSearchResult: any[] = [];

	constructor(
		private storeUtilService: StoreGlobalUtilService,
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private _productService: ProductService,
		private supplierService: SupplierService,
		private apmisFilterService: ApmisFilterBadgeService,
		private systemModuleService: SystemModuleService,
		private purchaseListService: PurchaseOrderService
	) {
		this.apmisFilterService.clearItemsStorage(true);
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
							.then((payload2) => {
								this.loginEmployee = payload2;
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
								.then((payload2) => {
									this.loginEmployee = payload2;
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
		this.apmisFilterService.clearItemsStorage(true);
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
		this.getSuppliers();
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
						console.log(payload);
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
			config.quantityRequired = 0;
			config.costPrice = 0;
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

	onshowSup_search() {
		this.sup_search = !this.sup_search;
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
					this.suppliers = payload.data;
					this.supplierSearchResult = payload.data.map((c) => {
						return { id: c._id, label: c.supplier.name };
					});
				},
				(error) => {}
			);
	}

	onSearchSelectedItems(data: any[]) {
		if (data.length > 0) {
			this.selectedSuppliers = this.suppliers.filter((supplier) => {
				const res = data.find((dt) => dt.id.toString() === supplier._id.toString());
				if (res !== undefined) {
					return supplier;
				}
			});
			this.selectedLocalStorageSuppliers = data;
		} else {
			this.selectedSuppliers = [];
		}
	}

	removeSupplier(supplier) {
		const res = this.selectedLocalStorageSuppliers.filter((dt) => dt.id.toString() !== supplier._id.toString());
		console.log(res);
		this.apmisFilterService.edit(true, res);
		this.onSearchSelectedItems(res);
		this.selectedLocalStorageSuppliers = res;
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
	submit() {
		this.systemModuleService.on();
		const purchaseList: PurchaseList = <PurchaseList>{};
		purchaseList.facilityId = this.selectedFacility._id;
		purchaseList.storeId = this.checkingStore.storeId;
		purchaseList.listedProducts = [];
		purchaseList.purchaseListNumber = '';
		purchaseList.createdBy = this.loginEmployee._id;
		purchaseList.suppliersId = this.selectedLocalStorageSuppliers;
		this.selectedProducts.forEach((product) => {
			const listedItem: ListedItem = <ListedItem>{};
			listedItem.costPrice = product.costPrice;
			listedItem.productId = product.productId;
			listedItem.productName = product.productName;
			listedItem.quantity = product.quantityRequired;
			listedItem.productConfiguration = product.productConfiguration;
			purchaseList.listedProducts.push(listedItem);
		});

		this.purchaseListService.createPurchaseList(purchaseList).then(
			(payload) => {
				this.selectedProducts = [];
				this.getInventoryList();
				this.modifyProducts(this.productConfigs);
				this.systemModuleService.off();
				this.systemModuleService.announceSweetProxy(
					'Your product has been initialised successfully',
					'success',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
			},
			(error) => {
				console.log(error);
				this.systemModuleService.off();
			}
		);
	}

	save() {
		// if (this.saveBtnText === 'Done') {
		const purchaseOrder: PurchaseOrder = <PurchaseOrder>{};
		// 	purchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
		// 	purchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
		// 	purchaseOrder.remark = this.frm_purchaseOrder.value.desc;
		// 	purchaseOrder.storeId = this.checkingObject.storeId;
		// 	purchaseOrder.facilityId = this.selectedFacility._id;
		// 	purchaseOrder.createdBy = this.loginEmployee._id;
		// 	purchaseOrder.orderedProducts = [];
		// 	(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
		// 		const item = itemi.value;
		// 		const product: any = <any>{};
		// 		product.productId = item.id;
		// 		let val = JSON.parse(JSON.stringify(item));
		// 		val.name = val.product;
		// 		delete val.product;
		// 		product.productObject = val;
		// 		product.quantity = item.qty;
		// 		product.qtyDetails = [];
		// 		item.config.forEach((element) => {
		// 			product.qtyDetails.push({
		// 				packId: element.packItem,
		// 				quantity: element.size
		// 			});
		// 		});
		// 		purchaseOrder.orderedProducts.push(product);
		// 	});
		// 	this.purchaseOrderService.create(purchaseOrder).then(
		// 		(payload) => {
		// 			this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
		// 			this.systemModuleService.announceSweetProxy(
		// 				'Purchase order ' + payload.purchaseOrderNumber + ' was created',
		// 				'success',
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null
		// 			);
		// 			this.frm_purchaseOrder.reset();
		// 			this.router.navigate([ '/dashboard/purchase-manager/orders' ]);
		// 			this.loading = false;
		// 		},
		// 		(error) => {
		// 			this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
		// 			this.loading = false;
		// 		}
		// 	);
		// } else {
		// 	this.selectedPurchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
		// 	this.selectedPurchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
		// 	this.selectedPurchaseOrder.remark = this.frm_purchaseOrder.value.desc;
		// 	this.selectedPurchaseOrder.storeId = this.checkingObject.storeId;
		// 	this.selectedPurchaseOrder.facilityId = this.selectedFacility._id;
		// 	this.selectedPurchaseOrder.createdBy = this.loginEmployee._id;
		// 	this.selectedPurchaseOrder.orderedProducts = [];
		// 	(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
		// 		const item = itemi.value;
		// 		const product: any = <any>{};
		// 		product.productId = item.id;
		// 		let val = JSON.parse(JSON.stringify(item));
		// 		val.name = val.product;
		// 		delete val.product;
		// 		product.productObject = val;
		// 		product.quantity = item.qty;
		// 		product.qtyDetails = [];
		// 		item.config.forEach((element) => {
		// 			let val: any = <any>{};
		// 			val.packId = element.packItem;
		// 			val.quantity = element.size;
		// 			product.qtyDetails.push(val);
		// 		});
		// 		this.selectedPurchaseOrder.orderedProducts.push(product);
		// 	});
		// 	this.purchaseOrderService.patch(this.selectedPurchaseOrder._id, this.selectedPurchaseOrder).subscribe(
		// 		(payload) => {
		// 			this.systemModuleService.announceSweetProxy(
		// 				'Purchase order ' + payload.purchaseOrderNumber + ' was updated',
		// 				'success',
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null,
		// 				null
		// 			);
		// 			this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
		// 			this.unCheckedAllProducts();
		// 			this.router.navigate([ '/dashboard/purchase-manager/orders' ]);
		// 			this.loading = false;
		// 		},
		// 		(error) => {
		// 			this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
		// 			this.loading = false;
		// 		}
		// 	);
		// }
	}

	isAllCheckedProductValid() {
		// this.selectedProducts.find(product => product.)
	}
}
