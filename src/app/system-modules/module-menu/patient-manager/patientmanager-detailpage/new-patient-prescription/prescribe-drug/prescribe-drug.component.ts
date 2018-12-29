import { DrugListApiService } from './../../../../../../services/facility-manager/setup/drug-list-api.service';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subject } from 'rxjs/Subject';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
	FacilitiesService,
	PrescriptionService,
	PrescriptionPriorityService,
	FrequencyService,
	EmployeeService
} from 'app/services/facility-manager/setup';
// import { DurationUnits, DosageUnits } from '../../../../../shared-module/helpers/global-config';
import { Prescription, PrescriptionItem, Facility } from 'app/models';
import { DurationUnits, DosageUnits } from 'app/shared-module/helpers/global-config';
import { DrugInteractionService } from '../services/drug-interaction.service';

@Component({
	selector: 'app-prescribe-drug',
	templateUrl: './prescribe-drug.component.html',
	styleUrls: [ './prescribe-drug.component.scss' ]
})
export class PrescribeDrugComponent implements OnInit {
	@Output() prescriptionItems: Prescription = <Prescription>{};
	drugSearch = false;
	priorities: string[] = [];
	dosageUnits: any[] = [];
	prescriptions: Prescription = <Prescription>{};
	prescriptionArray: PrescriptionItem[] = [];
	drugs: string[] = [];
	routes: string[] = [];
	frequencies: string[] = [];
	durationUnits: any[] = [];
	selectedValue: any;
	selectedDosage: any;
	products: any[] = [];
	commonProducts: any[] = [];

	addPrescriptionForm: FormGroup;
	allPrescriptionsForm: FormGroup;

	// drugSearchFormControl: FormControl = new FormControl();
	selectedFacility: any;
	subscription: any;
	checkingStore: any;
	loginEmployee: any;
	searchHasBeenDone = false;
	selectedProductName: any;
	selectedProduct: any;
	refillCount = 0;
	startDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
	endDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
	showRefill: false;
	currentPrescription: Prescription = <Prescription>{};
	constructor(
		private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _prescriptionService: PrescriptionService,
		private _priorityService: PrescriptionPriorityService,
		private _frequencyService: FrequencyService,
		private _employeeService: EmployeeService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
		private _drugListApiService: DrugListApiService,
		private _drugInteractionService: DrugInteractionService
	) {
		this._authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this._getCommonlyPrescribedDrugs();
			this._getAllFrequencies();
			this._getAllPriorities();
		});
	}
	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.currentPrescription.prescriptionItems = [];
		this.prescriptionItems.prescriptionItems = [];
		this.durationUnits = DurationUnits;
		this.dosageUnits = DosageUnits;
		this.selectedValue = DurationUnits[1].name;
		this.selectedDosage = DosageUnits[0].name;

		this.addPrescriptionForm = this.fb.group({
			// dosage: [ '', [ <any>Validators.required ] ],
			// dosageUnit: [ '', [ <any>Validators.required ] ],
			drug: [ '', [ <any>Validators.required ] ],
			code: [ '', [ <any>Validators.required ] ],
			productId: [ '', [ <any>Validators.required ] ],
			regimenArray: this.fb.array([ this.initRegimen() ]),
			refillCount: [ this.refillCount ],
			refill: [ false, [] ],
			startDate: [ new Date().toISOString().substring(0, 10), [ <any>Validators.required ] ],
			endDate: [ new Date().toISOString().substring(0, 10), [] ],
			specialInstruction: [ '' ]
		});

		this.addPrescriptionForm.controls['drug'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe((value) => {
				this.searchHasBeenDone = false;
				const searchList = this.canSearchBeDone(value.split(','));
				if (searchList.length > 1 && this.selectedProductName.length === 0) {
					this.selectedProductName = '';
					this._drugListApiService
						.find({
							query: {
								searchtext: searchList,
								po: false,
								brandonly: false,
								genericonly: true,
								$limit: false
							}
						})
						.then(
							(payload) => {
								this.products = this.modifyProducts(payload.data);
								if (this.products.length === 0) {
									this.searchHasBeenDone = true;
								} else {
									this.searchHasBeenDone = false;
								}
							},
							(error) => {
								this.searchHasBeenDone = false;
							}
						);
				} else {
					this.selectedProductName = '';
				}
			});

		this.addPrescriptionForm.controls['refill'].valueChanges.subscribe((value) => {
			this.showRefill = value;
		});
	}

	initRegimen() {
		return this.fb.group({
			dosage: [ '', [ <any>Validators.required ] ],
			frequency: [ '', [ <any>Validators.required ] ],
			duration: [ '', [ <any>Validators.required ] ]
			// durationUnit: [ this.durationUnits[1].name, [ <any>Validators.required ] ]
		});
	}

	onClickAddRegimen() {
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		control.push(this.initRegimen());
	}

	canSearchBeDone(list: any[]) {
		return list.filter((value) => value.trim().length > 0).map((l) => l.trim());
	}

	private _getAllPriorities() {
		this._priorityService
			.findAll()
			.then((res) => {
				this.priorities = res.data;
				const priority = res.data.filter((x) => x.name.toLowerCase().includes('normal'));
				if (priority.length > 0) {
					this.allPrescriptionsForm.controls['priority'].setValue(priority[0]);
				}
			})
			.catch((err) => {});
	}

	private _getCommonlyPrescribedDrugs() {
		this._drugListApiService
			.find_commonly_prescribed({
				query: {
					facilityId: this.selectedFacility._id,
					personId: this.loginEmployee.personId
				}
			})
			.then((res) => {
				this.commonProducts = res.data.map((common) => common.productObject);
			})
			.catch((err) => {});
	}

	private _getAllFrequencies() {
		this._frequencyService
			.findAll()
			.then((res) => {
				if (res.data.length > 0) {
					this.frequencies = res.data;
				}
			})
			.catch((err) => {});
	}

	modifyProducts(products: any[]) {
		return products.map((product) => {
			product.marked = this.validateAgainstDuplicateProductEntry(product) === false ? true : false;
			return product;
		});
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = this.commonProducts.find((x) => x.id.toString() === product.id.toString());
		return result === undefined ? true : false;
	}

	onFocus(focus) {
		if (focus === 'in') {
			this.drugSearch = true;
		} else {
			// setTimeout(() => {
			//   this.drugSearch = false;
			// }, 500);
		}
	}
	close_search(event) {
		this.drugSearch = false;
		if (!!event) {
			this.selectedProductName = event.name;
			this.selectedProduct = event;
			this.drugSearch = false;
			// this.drugSearchFormControl.setValue(this.selectedProductName);
			console.log(this.selectedProduct);
			this.addPrescriptionForm.controls['drug'].setValue(this.selectedProductName);
			this.addPrescriptionForm.controls['code'].setValue(this.selectedProduct.code);
			this.addPrescriptionForm.controls['productId'].setValue(this.selectedProduct.id);
			// code: ""
			// dosage: ""
			// dosageUnit: ""
			// drug: "Amoxicillin 500 MG / Sulbactam 250 MG Oral Tablet"
			// productId: ""
			// refillCount: 0
			// specialInstruction: ""
		} else {
			this.selectedProductName = '';
			this.selectedProduct = undefined;
			this.drugSearch = false;
		}
	}

	async mark_product(event) {
		if (this.validateAgainstDuplicateProductEntry(event.product)) {
			const commonDrug = {
				facilityId: this.selectedFacility._id,
				personId: this.loginEmployee.personId,
				productObject: event.product
			};
			const createdCommonlyPrescribed = await this._drugListApiService.create_commonly_prescribed(commonDrug);
			if (!!createdCommonlyPrescribed) {
				this.commonProducts.push(event.product);
			}
		} else {
			try {
				const removedCommonlyPrescribed = await this._drugListApiService.remove_commonly_prescribed(null, {
					query: { 'productObject.id': event.product.id }
				});
				if (!!removedCommonlyPrescribed) {
					this.commonProducts = this.commonProducts.filter(
						(x) => x.id.toString() !== event.product.id.toString()
					);
				}
			} catch (error) {}
		}
	}

	isValid() {
		// console.log(this.addPrescriptionForm.valid);
		return this.addPrescriptionForm.valid !== true;
	}
	add() {
		// let prescription: PrescriptionItem = PrescriptionItem({});
		const item: PrescriptionItem = <PrescriptionItem>{};
		item.genericName = this.addPrescriptionForm.controls['drug'].value;
		item.productId = this.addPrescriptionForm.controls['productId'].value;
		item.isRefill = this.addPrescriptionForm.controls['refill'].value;
		item.refillCount = this.addPrescriptionForm.controls['refillCount'].value;
		item.code = this.addPrescriptionForm.controls['code'].value;

		this.currentPrescription.prescriptionItems.push(item);
		this._drugInteractionService.checkDrugInteractions(this.currentPrescription.prescriptionItems);
	}
}
