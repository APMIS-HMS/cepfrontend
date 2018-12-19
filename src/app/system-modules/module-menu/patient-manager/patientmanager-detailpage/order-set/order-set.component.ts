import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SystemModuleService } from './../../../../../services/module-manager/setup/system-module.service';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	FormsService,
	FacilitiesService,
	OrderSetTemplateService,
	DocumentationService,
	PersonService,
	PatientService,
	TreatmentSheetService
} from 'app/services/facility-manager/setup';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';
import { SharedService } from '../../../../../shared-module/shared.service';
import { OrderSetTemplate, User, Facility, Prescription } from '../../../../../models/index';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { Observable } from 'rxjs/Observable';
import { TreatmentSheetActions, InvalidTreatmentReport } from '../../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-order-set',
	templateUrl: './order-set.component.html',
	styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {
	@Output() showDoc: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	addProblem: boolean = false;
	@Input() selectedPatient: any;
	@Input() treatmentSheetId: any;
	prescriptionData: Prescription = <Prescription>{};
	investigationData: any = <any>{};
	template: FormControl = new FormControl();
	diagnosis: FormControl = new FormControl();
	selectedProblem: any = <any>{};
	disableAuthorizerxButton = false;
	selectedTreatmentSheet: any;
	patientDocumentation: any = <any>{};
	problems: any = <any>[];
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	isButtonEnabled = true;
	editedValue = {};
	employeeDetails: any = <any>{};
	apmisLookupQuery = {};
	apmisLookupUrl = 'order-mgt-templates';
	apmisLookupDisplayKey = 'name';
	apmisLookupText = '';
	apmisDLookupQuery = {};
	apmisDLookupDisplayKey = 'diagnosis';
	apmisDLookupText = '';
	popMed = false;
	popInvestigation = false;
	popNursingCare = false;
	popPhysicianOrder = false;
	popProcedure = false;
	showMedicationBill = false;
	showInvestigationBill = false;
	user: any = <any>{};
	orderSet: any = <any>{};
	selectedForm: any;

	constructor(
		private _route: ActivatedRoute,
		private _locker: CoolLocalStorage,
		private _orderSetSharedService: OrderSetSharedService,
		private _orderSetTemplateService: OrderSetTemplateService,
		public facilityService: FacilitiesService,
		private sharedService: SharedService,
		private _formService: FormsService,
		private _personService: PersonService,
		private _patientService: PatientService,
		private _treatmentSheetService: TreatmentSheetService,
		private _documentationService: DocumentationService,
		private _authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService
	) {
		this._authFacadeService.getLogingEmployee().then((res: any) => {
			this.employeeDetails = res;
		});
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');

		this._route.params.subscribe((value) => {
			this._getPatient(value.id);
		});

		// Listen to the event from children components
		this._orderSetSharedService.itemSubject.subscribe((value) => {
			if (!!value.medications) {
				if (!!this.orderSet.medications) {
					const findItem = this.orderSet.medications.filter(
						(x) =>
							x.genericName === value.medications[0].genericName &&
							x.strength === value.medications[0].strength
					);
					if (findItem.length === 0) {
						if (value.medications[0].isExisting !== true) {
							value.medications[0].tracks =
								value.medications[0].tracks === undefined ? [] : value.medications[0].tracks;
							const treatmentSheetTrack = {
								action: TreatmentSheetActions.ADDED,
								createdBy: this.employeeDetails._id,
								comment: ''
							};
							value.medications[0].tracks.push(treatmentSheetTrack);
						}
						this.orderSet.medications.push(value.medications[0]);
					}
				} else {
					this.orderSet.medications = value.medications;
				}
			} else if (!!value.investigations) {
				if (!!this.orderSet.investigations) {
					const findItem = this.orderSet.investigations.filter((x) => x._id === value.investigations[0]._id);
					if (findItem.length === 0) {
						if (value.investigations[0].isExisting !== true) {
							value.investigations[0].tracks =
								value.investigations[0].tracks === undefined ? [] : value.investigations[0].tracks;
							const treatmentSheetTrack = {
								action: TreatmentSheetActions.ADDED,
								createdBy: this.employeeDetails._id,
								comment: ''
							};
							value.investigations[0].tracks.push(treatmentSheetTrack);
						}
						this.orderSet.investigations.push(value.investigations[0]);
					}
				} else {
					this.orderSet.investigations = value.investigations;
				}
			} else if (!!value.procedures) {
				if (!!this.orderSet.procedures) {
					const findItem = this.orderSet.procedures.filter((x) => x._id === value.procedures[0]._id);
					if (findItem.length === 0) {
						if (value.procedures[0].isExisting !== true) {
							value.procedures[0].tracks =
								value.procedures[0].tracks === undefined ? [] : value.procedures[0].tracks;
							const treatmentSheetTrack = {
								action: TreatmentSheetActions.ADDED,
								createdBy: this.employeeDetails._id,
								comment: ''
							};
							value.procedures[0].tracks.push(treatmentSheetTrack);
						}
						this.orderSet.procedures.push(value.procedures[0]);
					}
				} else {
					this.orderSet.procedures = value.procedures;
				}
			} else if (!!value.nursingCares) {
				if (!!this.orderSet.nursingCares) {
					const findItem = this.orderSet.nursingCares.filter((x) => x.name === value.nursingCares[0].name);
					if (findItem.length === 0) {
						if (value.nursingCares[0].isExisting !== true) {
							value.nursingCares[0].tracks =
								value.nursingCares[0].tracks === undefined ? [] : value.nursingCares[0].tracks;
							const treatmentSheetTrack = {
								action: TreatmentSheetActions.ADDED,
								createdBy: this.employeeDetails._id,
								comment: ''
							};
							value.nursingCares[0].tracks.push(treatmentSheetTrack);
						}
						this.orderSet.nursingCares.push(value.nursingCares[0]);
					}
				} else {
					this.orderSet.nursingCares = value.nursingCares;
				}
			} else if (!!value.physicianOrders) {
				if (!!this.orderSet.physicianOrders) {
					const findItem = this.orderSet.physicianOrders.filter(
						(x) => x.name === value.physicianOrders[0].name
					);
					if (findItem.length === 0) {
						if (value.physicianOrders[0].isExisting !== true) {
							value.physicianOrders[0].tracks =
								value.physicianOrders[0].tracks === undefined ? [] : value.physicianOrders[0].tracks;
							const treatmentSheetTrack = {
								action: TreatmentSheetActions.ADDED,
								createdBy: this.employeeDetails._id,
								comment: ''
							};
							value.physicianOrders[0].tracks.push(treatmentSheetTrack);
						}
						this.orderSet.physicianOrders.push(value.physicianOrders[0]);
					}
				} else {
					this.orderSet.physicianOrders = value.physicianOrders;
				}
			}
		});

		this._documentationService.announceDocumentation$.subscribe((payload) => {
			this.getPatientsProblems();
		});
		this.editTreatmentSheet();
	}

	editTreatmentSheet() {
		if (this.treatmentSheetId !== null && this.treatmentSheetId !== undefined) {
			this.orderSet = {};
			this._treatmentSheetService.get(this.treatmentSheetId, {}).then((payload) => {
				this.selectedTreatmentSheet = payload;
				this.selectedProblem = payload.problem;
				this.orderSet = payload.treatmentSheet;
				if (this.orderSet.investigations !== undefined) {
					this.orderSet.investigations.forEach((element) => {
						element.isExisting = true;
					});
				}
				if (this.orderSet.medications !== undefined) {
					this.orderSet.medications.forEach((element) => {
						element.isExisting = true;
					});
				}
				if (this.orderSet.procedures !== undefined) {
					this.orderSet.procedures.forEach((element) => {
						element.isExisting = true;
					});
				}
				if (this.orderSet.nursingCares !== undefined) {
					this.orderSet.nursingCares.forEach((element) => {
						element.isExisting = true;
					});
				}
				if (this.orderSet.physicianOrders !== undefined) {
					this.orderSet.physicianOrders.forEach((element) => {
						element.isExisting = true;
					});
				}
			});
		}
	}

	compareProblem(l1: any, l2: any) {
		let l = l1.find((x) => x === l2);
		return l;
	}

	getPatientsProblems() {
		Observable.fromPromise(
			this._documentationService.find({
				query: {
					personId: this.selectedPatient.personId,
					'documentations.patientId': this.selectedPatient._id
					// $select: ['documentations.documents', 'documentations.facilityId']
				}
			})
		).subscribe(
			(mload: any) => {
				if (mload.data.length > 0) {
					this.patientDocumentation = mload.data[0];
					this.getProblems();
				}
			},
			(error) => { }
		);
	}

	getProblems() {
		this.problems = [];
		this.patientDocumentation.documentations.forEach((documentation) => {
			if (
				documentation.document !== undefined &&
				documentation.document.documentType !== undefined &&
				documentation.document.documentType.title === 'Problems'
			) {
				documentation.document.body.problems.forEach((problem) => {
					if (problem.status !== null && problem.status.name === 'Active') {
						this.problems.push(problem);
					}
				});
			}
		});
	}

	showOrderSetType(type: string) {
		if (type === 'medication') {
			this.popMed = true;
		} else if (type === 'investigation') {
			this.popInvestigation = true;
		} else if (type === 'nursing care') {
			this.popNursingCare = true;
		} else if (type === 'physician order') {
			this.popPhysicianOrder = true;
		} else if (type === 'procedure') {
			this.popProcedure = true;
		}
	}

	authorizerx() {
		this.disableAuthorizerxButton = true;
		if (this.selectedTreatmentSheet === undefined) {
			this.systemModuleService.on();
			this.isButtonEnabled = false;
			const data = {
				personId: this.selectedPatient.personDetails._id,
				treatmentSheet: this.orderSet,
				facilityId: this.facility._id,
				createdBy: this.employeeDetails._id
			};
			this._treatmentSheetService
				.setTreatmentSheet(data, {
					query: {
						facilityId: this.facility._id,
						personId: this.selectedPatient.personId
					}
				})
				.then(
					(treatment) => {
						this.disableAuthorizerxButton = false;
						this.systemModuleService.off();
						this.isButtonEnabled = true;
						this.sharedService.announceOrderSet(this.orderSet);
						this.close_onClickModal();
					},
					(err) => {
						this.disableAuthorizerxButton = false;
						this.systemModuleService.off();
					}
				)
				.catch((err) => {
					this.disableAuthorizerxButton = false;
					this.systemModuleService.off();
					this.orderSet = {};
					this.sharedService.announceOrderSet(this.orderSet);
					this.close_onClickModal();
				});
			this.showDoc.emit(true);
		} else if (this.selectedTreatmentSheet !== undefined) {
			this.systemModuleService.on();
			this.isButtonEnabled = false;
			const treatementSheet = {
				personId: this.selectedPatient.personDetails._id,
				treatmentSheet: this.orderSet,
				facilityId: this.facility._id,
				createdBy: this.employeeDetails._id
			};
			this._treatmentSheetService
				.updateTreatmentSheet(this.selectedTreatmentSheet._id, treatementSheet, {})
				.then((treatment) => {
					this.disableAuthorizerxButton = false;
					this.systemModuleService.off();
					this.isButtonEnabled = true;
					this.sharedService.announceOrderSet(this.orderSet);
					this.close_onClickModal();
				})
				.catch((err) => {
					this.disableAuthorizerxButton = false;
					this.systemModuleService.off();
					this.orderSet = {};
					this.sharedService.announceOrderSet(this.orderSet);
					this.close_onClickModal();
				});
			this.showDoc.emit(true);
		} else {
			this.disableAuthorizerxButton = false;
			this.systemModuleService.announceSweetProxy(
				'Please select a problem before creating an order set',
				'error'
			);
		}
	}

	removeProcedure_show(i) {
		this.orderSet.procedures.splice(i, 1);
	}

	deleteOrderSetItem(index: number, value: any, type: string) {
		if (type === 'medication') {
			const findItem = this.orderSet.medications.filter(
				(x) => x.genericName === value.genericName && x.strength === value.strength
			);

			if (findItem.length > 0) {
				this.orderSet.medications.splice(index, 1);
			}
		} else if (type === 'investigation') {
			const findItem = this.orderSet.investigations.filter((x) => x._id === value._id);

			if (findItem.length > 0) {
				this.orderSet.investigations.splice(index, 1);
			}
		} else if (type === 'procedure') {
			const findItem = this.orderSet.procedures.filter((x) => x._id === value._id);

			if (findItem.length > 0) {
				this.orderSet.procedures.splice(index, 1);
			}
		} else if (type === 'nursingCare') {
			const findItem = this.orderSet.nursingCares.filter((x) => x.name === value.name);

			if (findItem.length > 0) {
				this.orderSet.nursingCares.splice(index, 1);
			}
		} else if (type === 'physicianOrder') {
			const findItem = this.orderSet.physicianOrders.filter((x) => x.name === value.name);

			if (findItem.length > 0) {
				this.orderSet.physicianOrders.splice(index, 1);
			}
		}
	}

	private _getPatient(id) {
		this._patientService
			.find({
				query: {
					facilityId: this.miniFacility._id,
					personId: id
				}
			})
			.then((res) => {
				if (res.data.length > 0) {
					this.selectedPatient = res.data[0];
					this.getPatientsProblems();
				}
			})
			.catch((err) => { });
	}

	addProblem_show() {
		this.addProblem = true;
	}

	onClickBillPrescription(index: number, value: any) {
		this.prescriptionData.index = index;
		this.prescriptionData.prescriptionItems = this.orderSet.medications;
		this.showMedicationBill = true;
	}

	onClickBillInvestigation(index: number, value: any) {
		this.investigationData.index = index;
		this.investigationData.investigationItems = this.orderSet.investigations;
		this.showInvestigationBill = !this.showInvestigationBill;
	}

	apmisLookupHandleSelectedItem(value: any) {
		this.apmisLookupText = value.name;
		this.diagnosis.setValue('');
		this.template.setValue(value.name);
		this.orderSet = JSON.parse(value.body);
	}

	apmisDLookupHandleSelectedItem(value: any) {
		this.apmisDLookupText = value.name;
		this.template.setValue('');
		this.diagnosis.setValue(value.diagnosis);
		this.orderSet = JSON.parse(value.body);
	}

	private _getOrderSetTemplate() {
		this._orderSetTemplateService
			.find({
				query: { facilityId: this.facility._id }
			})
			.then((res) => {
				if (res.data.length > 0) {
					this.orderSet = JSON.parse(res.data[0].body);
				}
			})
			.catch((err) => { });
	}

	close_onClick(e) {
		this.popMed = false;
		this.popInvestigation = false;
		this.popNursingCare = false;
		this.popPhysicianOrder = false;
		this.popProcedure = false;
		this.showMedicationBill = false;
		this.showInvestigationBill = false;
		this.addProblem = false;
	}

	close_onClickModal() {
		this.closeModal.emit(true);
	}

	popProcedure_show(value) {
		this.popProcedure = true;
		this.editedValue = value;
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
