import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Locker } from 'angular2-locker';
import {
	FacilitiesService, PrescriptionService,
	PrescriptionPriorityService, DictionariesService,
	RouteService, FrequencyService, DrugListApiService, DrugDetailsApiService
} from '../../../../../services/facility-manager/setup/index';
import { Appointment, Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import { drugWeight, durationUnit } from '../../../../../shared-module/helpers/global-config';
import 'devextreme-intl';

@Component({
	selector: 'app-patient-prescription',
	templateUrl: './patient-prescription.component.html',
	styleUrls: ['./patient-prescription.component.scss']
})
export class PatientPrescriptionComponent implements OnInit {
	@Input() employeeDetails: any;
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Output() prescriptionItems: PrescriptionItem[] = [];
	facility: Facility = <Facility>{};

	showCuDropdown: boolean = false;
	cuDropdownLoading: boolean = false;
	addPrescriptionShow: boolean = false;
	medicalShow: boolean = false;
	mainErr: boolean = true;
	errMsg: string = 'You have unresolved errors';
	addPrescriptionForm: FormGroup;
	allPrescriptionsForm: FormGroup;
	facilityId: string;
	employeeId: string;
	patientId: string;
	priorities: string[] = [];
	prescriptions: Prescription = <Prescription>{};
	//prescriptionItems: PrescriptionItem[] = [];
	drugs: string[] = [];
	routes: string[] = [];
	frequencies: string[] = [];
	durationUnits: any[] = [];
	selectedValue: any;
	drugId: string = "";
	selectedDrugId: string = "";
	searchText: string = "";
	refillCount: number;
	currentDate: Date;
	minDate: Date;

	constructor(
		private fb: FormBuilder,
		private _locker: Locker,
		private _el: ElementRef,
		private _route: ActivatedRoute,
		private _facilityService: FacilitiesService,
		private _prescriptionService: PrescriptionService,
		private _priorityService: PrescriptionPriorityService,
		private _dictionaryService: DictionariesService,
		private _frequencyService: FrequencyService,
		private _routeService: RouteService,
		private _drugListApi: DrugListApiService,
		private _drugDetailsApi: DrugDetailsApiService
	) {

	}

	ngOnInit() {
		this.facility = this._locker.get('selectedFacility');
		this._route.params.subscribe(params => {
			this.patientId = params['id'];
		});

		this.currentDate = new Date();
		this.minDate = new Date();
		this.durationUnits = durationUnit;
		this.refillCount = 0;
		this.selectedValue = durationUnit[0].name;
		console.log(this.currentDate);
		//this.getAllDrugs();
		this.getAllPriorities();
		this.getAllRoutes();
		this.getAllFrequencies();

		this.allPrescriptionsForm = this.fb.group({
			priority: ['', [<any>Validators.required]],
		});

		this.addPrescriptionForm = this.fb.group({
			strength: ['', [<any>Validators.required]],
			route: ['', [<any>Validators.required]],
			drug: ['', [<any>Validators.required]],
			frequency: ['', [<any>Validators.required]],
			duration: ['', [<any>Validators.required]],
			durationUnit: ['', [<any>Validators.required]],
			refillCount: [''],
			startDate: [''],
			substitution: [''],
			specialInstruction: ['']
		});
	}

	onClickAddPrescription(value: any, valid: boolean) {
		if (valid) {
			if (this.selectedAppointment.clinicId === undefined) {
				this._facilityService.announceNotification({
					type: "Info",
					text: "Clinic has not been set!"
				});
			} else {
				let prescriptionItem = <PrescriptionItem>{
					genericName: value.drug,
					routeName: value.route,
					frequency: value.frequency,
					duration: value.duration + value.durationUnit,
					startDate: value.startDate,
					strength: value.strength,
					patientInstruction: value.specialInstruction,
					refillCount: value.refillCount
				};

				let length = this.prescriptionItems.length;
				if (value.id === undefined) {
					prescriptionItem.id = ++length;
				} else {
					prescriptionItem.id = value.id;
				}

				this.addPrescriptionShow = true;
				this.prescriptionItems.push(prescriptionItem);

				let prescription = <Prescription>{
					facilityId: this.facility._id,
					employeeId: this.employeeDetails.employeeDetails._id,
					clinicId: this.selectedAppointment.clinicId,
					priorityId: value.priority,
					patientId: this.patientId,
					prescriptionItems: this.prescriptionItems,
					isAuthorised: true
				};

				console.log(prescription);
				this.prescriptions = prescription;
				this.addPrescriptionForm.reset();
			}
		}
	}

	onClickSavePrescription(value: any, valid: boolean) {
		if (valid) {
			if(this.selectedAppointment.clinicId === undefined) {
				this._facilityService.announceNotification({
					type: "Info",
					text: "Clinic has not been set!"
				});
			} else {
				let itemToSave = this.prescriptions;
				itemToSave.priorityId = value.priority;
				this._prescriptionService.create(itemToSave)
					.then(res => {
						this._facilityService.announceNotification({
							type: "Success",
							text: "Prescription has been added!"
						});
						this.prescriptionItems = [];
						this.addPrescriptionForm.reset();
					})
					.catch(err => {
						this._facilityService.announceNotification({
							type: "Error",
							text: "There was an error creating prescription. Please try again later."
						});
						console.log(err);
					});
			}
		} else {
			this._facilityService.announceNotification({
				type: "Info",
				text: "Please select priority for these prescriptions!"
			});
		}
	}

	onClickReset() {
		this.addPrescriptionForm.reset();
	}

	getAllPriorities() {
		this._priorityService.findAll()
			.then(res => {
				this.priorities = res.data;
			})
			.catch(err => {
				console.log(err);
			});
	}

	getAllRoutes() {
		this._routeService.findAll()
			.then(res => {
				this.routes = res.data;
			})
			.catch(err => {
				console.log(err);
			});
	}

	getAllFrequencies() {
		this._frequencyService.findAll()
			.then(res => {
				this.frequencies = res.data;
			})
			.catch(err => {
				console.log(err);
			});
	}

	// Get all drugs from generic
	// getAllDrugs() {
	// 	this._dictionaryService.findAll()
	// 		.then(res => {
	// 			console.log(res);
	// 			this.drugs = res.data;
	// 		})
	// 		.catch(err => {
	// 			console.log(err);
	// 		});
	// }

	keyupSearch() {
		this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(val => {
			this.searchText = val;
		});

		if (this.searchText.length > 4) {
			this.drugs = [];
			this.cuDropdownLoading = true;
			this._drugListApi.find({ query: { "searchtext": this.searchText, "po": false, "brandonly": false, "genericonly": true } })
				.then(res => {
					this.cuDropdownLoading = false;
					this.drugs = res.reverse();
				})
				.catch(err => {
					this.cuDropdownLoading = false;
					console.log(err);
				});
		}
	}

	onClickCustomSearchItem(event, drugId) {
		this.addPrescriptionForm.controls['drug'].setValue(event.srcElement.innerText);
		//this._el.nativeElement.getElementsByTagName('input')[0].value = event.srcElement.innerText;
		let productId = drugId.getAttribute('data-drug-id');
		this._drugDetailsApi.find({ query: { "productId": productId } })
				.then(res => {
					if(res.ingredients.length === 1) {
						if(res.ingredients[0].strength !== undefined || res.ingredients[0].strengthUnit !== undefined) {
							this.selectedDrugId = res.ingredients[0].strength + res.ingredients[0].strengthUnit;
							this.addPrescriptionForm.controls['strength'].setValue(this.selectedDrugId);
						} else {
							this.addPrescriptionForm.controls['strength'].setValue("");
						}

						if(res.route !== "" || res.route !== undefined) {
							this.addPrescriptionForm.controls['route'].setValue(res.route);
						} else {
							this.addPrescriptionForm.controls['route'].setValue("");
						}
					}
				})
				.catch(err => {
					console.log(err);
				});
	}

	focusSearch() {
		this.showCuDropdown = !this.showCuDropdown;
	}

	focusOutSearch() {
		setTimeout(() => {
			this.showCuDropdown = !this.showCuDropdown;
		}, 300);
	}

	togglemedicalShow() {
		this.medicalShow = !this.medicalShow;
	}
}
