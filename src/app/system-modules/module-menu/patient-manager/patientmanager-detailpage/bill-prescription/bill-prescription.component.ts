import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
    FacilitiesService, ProductService, FacilityPriceService, InventoryService, AssessmentDispenseService
} from '../../../../../services/facility-manager/setup/index';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-bill-prescription',
	templateUrl: './bill-prescription.component.html',
	styleUrls: ['./bill-prescription.component.scss']
})
export class BillPrescriptionComponent implements OnInit {
	@Input() prescriptionData: Prescription = <Prescription>{};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	// @Input() employeeDetails: any;
	facility: Facility = <Facility>{};
	user: any = <any>{};

	addBillForm: FormGroup;
	drugs: any[] = [];
	selectedDrug = '';
	itemCost = 0;
	title = '';
	cost = 0; // Unit price for each drug.
	totalCost = 0; // Total price for each drug selected.
	totalQuantity = 0;
	batchNumber = '';
	qtyInStores = 0;
	storeId = '';
	stores: any = [];
	loading = true;
	serviceId = '';
	facilityServiceId = '';
	categoryId = '';

	mainErr = true;
	errMsg = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
    private _inventoryService: InventoryService,
    private _systemsModuleService: SystemModuleService,
		private _assessmentDispenseService: AssessmentDispenseService
	) { }

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		this.getProductsForGeneric();

		this.addBillForm = this._fb.group({
			drug: ['', [<any>Validators.required]],
			qty: [0, [<any>Validators.required]]
		});

		this.addBillForm.controls['qty'].valueChanges.subscribe(val => {
			if (val > 0) {
				this.totalQuantity = val;
				this.totalCost = this.cost * val;
			} else {
        this.mainErr = false;
        this.errMsg = 'Quantity should be greater than 0!!';
			}
		})
	}

	//
	onClickSaveCost(value, valid) {
		if (valid) {
			if (this.cost > 0 && value.qty > 0 && (value.drug !== undefined || value.drug === '')) {
				let index = this.prescriptionData.index;
				this.prescriptionData.prescriptionItems[index].productId = value.drug;
				this.prescriptionData.prescriptionItems[index].serviceId = this.serviceId;
				this.prescriptionData.prescriptionItems[index].facilityServiceId = this.facilityServiceId;
				this.prescriptionData.prescriptionItems[index].categoryId = this.categoryId;
				this.prescriptionData.prescriptionItems[index].productName = this.selectedDrug;
				this.prescriptionData.prescriptionItems[index].quantity = value.qty;
				this.prescriptionData.prescriptionItems[index].quantityDispensed = 0;
				this.prescriptionData.prescriptionItems[index].cost = this.cost;
				this.prescriptionData.prescriptionItems[index].totalCost = this.cost * value.qty;
				this.prescriptionData.prescriptionItems[index].isBilled = true;
				this.prescriptionData.prescriptionItems[index].facilityId = this.facility._id;
				this.prescriptionData.totalCost += this.totalCost;
				this.prescriptionData.totalQuantity += this.totalQuantity;

				this.closeModal.emit(true);
			} else {
        this.mainErr = false;
        this.errMsg = 'Unit price or Quantity is less than 0!';
			}
		} else {
      this.mainErr = false;
      this.errMsg = 'Unit price or Quantity is less than 0!';
		}
	}

	getProductsForGeneric() {
		const index = this.prescriptionData.index;
		this.title = this.prescriptionData.prescriptionItems[index].genericName;
		const ingredients = this.prescriptionData.prescriptionItems[index].ingredients;

		// Get the list of products from a facility, and then search if the generic
		// that was entered by the doctor in contained in the list of products
		this._assessmentDispenseService.find({ query: {
			action: 'genericSearch',
			facilityId: this.facility._id,
			ingredients: JSON.stringify(ingredients)
		}}).then(res => {
      		this.loading = false;
			if (res.status === 'success' && res.data.length > 0) {
				this.stores = res.data[0].availability;
				this.drugs = res.data;
			} else {
				this.drugs = [];
			}
		}).catch(err => console.error(err));
	}

	onClickCustomSearchItem(event, drugId) {
		this.selectedDrug = drugId.viewValue;
		const pId = drugId._element.nativeElement.getAttribute('data-p-id');
		this.serviceId = drugId._element.nativeElement.getAttribute('data-p-sId');
		this.facilityServiceId = drugId._element.nativeElement.getAttribute('data-p-fsid');
		this.categoryId = drugId._element.nativeElement.getAttribute('data-p-cid');
		// tslint:disable-next-line:radix
		this.cost = parseInt(drugId._element.nativeElement.getAttribute('data-p-price'));
		// tslint:disable-next-line:radix
		this.qtyInStores = parseInt(drugId._element.nativeElement.getAttribute('data-p-tqty'));
		const pAqty = drugId._element.nativeElement.getAttribute('data-p-aqty');
	}

	onClickClose(e) {
		 this.closeModal.emit(true);
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

}
