import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DocumentationTemplateService } from 'app/services/facility-manager/setup/documentation-template.service';
import { ScopeLevelService } from 'app/services/module-manager/setup';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import {
	Document,
	Documentation,
	Employee,
	Facility,
	Patient,
	PatientDocumentation
} from '../../../../../../models/index';
import {
	DocumentationService,
	FacilitiesService,
	FormsService
} from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { SystemModuleService } from '../../../../../../services/module-manager/setup/system-module.service';
import { SharedService } from '../../../../../../shared-module/shared.service';

import { VISIBILITY_GLOBAL } from './../../../../../../shared-module/helpers/global-config';

@Component({
	selector: 'app-clinical-note',
	templateUrl: './clinical-note.component.html',
	styleUrls: [ './clinical-note.component.scss' ]
})
export class ClinicalNoteComponent implements OnInit, OnDestroy {
	@Input() patient;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() showOrderset: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('surveyjs') surveyjs: any;
	@ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
	json: any;
	selectFormCtrl: FormControl;
	templateFormCtrl: FormControl;
	filteredStates: any;
	filteredForms: any;
	showDocument = false;
	personDocumentation: Documentation = <Documentation>{};
	docSymptom_view = false;
	docDiagnosis_view = false;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	states: any[] = [];
	forms: any[] = [];
	documents: Document[] = [];
	templates: any[] = [];
	symptoms: any[] = [];
	diagnoses: any[] = [];
	scopeLevels: any[] = [];
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	selectedForm: any = <any>{};
	orderSet: any = <any>{};
	showOrderSet = false;
	viewOrderManagement = false;
	viewDiagnosis: Boolean = false;
	public isSavingDraft = false;
	isManual = true;
	editingDocumentation: any;
	formJsonObject: any;
	subscription: Subscription;
	isEditingPatient = false;
	surveySubscription: Subscription;
	onDestroy$ = new Subject();
	constructor(
		private formService: FormsService,
		private locker: CoolLocalStorage,
		private documentationService: DocumentationService,
		private authFacadeService: AuthFacadeService,
		private formTypeService: FormTypeService,
		private sharedService: SharedService,
		public facilityService: FacilitiesService,
		private scopeLevelService: ScopeLevelService,
		private systemModuleService: SystemModuleService,
		private documentationTemplateService: DocumentationTemplateService
	) {
		this.authFacadeService
			.getLogingEmployee()
			.then((payload: any) => {
				this.loginEmployee = payload;
				this.getForms();
				this.getTemplates();
			})
			.catch((e) => {});

		this.selectFormCtrl = new FormControl();
		this.selectFormCtrl.valueChanges.subscribe((form) => {
			if (this.isManual == undefined || this.isManual === true) {
				this.isEditingPatient = false;
			}
			this.setSelectedForm(form);
		});

		this.sharedService.submitForm$.subscribe((value) => {
			this.symptoms = [];
			this.diagnoses = [];
			this.showDocument = false;
			this.orderSet = {};
		});

		this.sharedService.newFormAnnounced$.subscribe((value: any) => {
			if (value.isManual !== undefined && value.isManual === false) {
				if (value.isEditing) {
					this.isEditingPatient = true;

					this.selectFormCtrl.setValue(value.form);
					this.json = value.json;
				} else {
					// this.isEditingPatient = false;
				}
				if (value.isEditing !== undefined) {
					this.isManual = value.isManual;
				}
			} else {
				this.isManual = true;
			}
		});

		this.sharedService.editDocumentationAnnounced$.subscribe((value: any) => {
			// this.isEditingPatient = true;

			this.formJsonObject = undefined;
			if (value.main !== undefined && value.main.isEditing) {
				this.isEditingPatient = true;
			}
			if (value.leg === 0) {
				this.editingDocumentation = value.document;
				this.formJsonObject = value.main;
				this.isManual = value.main.isManual;
				this.isEditingPatient = true;
			} else {
				// this.isEditingPatient = false;
				// this.editingDocumentation = undefined; //comment when setSelectedForm
				// not working from observable this.formJsonObject = undefined;
			}
		});

		this.sharedService.announceFinishedSavingDraft$.subscribe(
			(payload: any) => {
				this.isSavingDraft = !payload;
			},
			(error) => {}
		);

		this.templateFormCtrl = new FormControl();
		this.templateFormCtrl.valueChanges.subscribe((temp) => {
			this.sharedService.announceTemplate(temp);
		});

		this.subscription = this.sharedService.surveyInitialized$.takeUntil(this.onDestroy$).subscribe((value: any) => {
			if (this.formJsonObject !== undefined && this.formJsonObject !== null) {
				this.selectFormCtrl.setValue(this.formJsonObject.form);
			}
			if (this.isEditingPatient) {
				value.surveyModel.data = this.editingDocumentation;
				this.surveyjs = value;
				this.sharedService.announceEditDocumentation({ document: this.editingDocumentation, leg: 1 });
			} else {
				this.editingDocumentation = undefined;
			}
		});
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');

		this.sharedService.announceOrderSetSource$.subscribe((value) => {
			this.orderSet = value;
			const payload = { type: 'OrderSet', action: 'add', data: value };
			// Send order set data one after another to the shared service
			this.sharedService.announceDiagnosisSystemOrder(payload);
		});
	}

	private getScopeLevel() {
		this.systemModuleService.on();
		this.scopeLevelService.find({}).then(
			(payload) => {
				this.scopeLevels = payload.data;
				this.systemModuleService.off();
			},
			(error) => {
				this.systemModuleService.off();
			}
		);
	}
	getTemplates() {
		this.systemModuleService.on();
		const model = this.makeTemplateModel();
		this.documentationTemplateService
			.find({
				query: { $or: [ { facilityId: model.facilityId }, { facilityId: undefined } ] }
			})
			.then((payload) => {
				this.templates = payload.data;
				this.systemModuleService.off();
			})
			.catch((errr) => {
				this.systemModuleService.off();
			});
	}

	makeTemplateModel() {
		return {
			facilityId: this.selectedFacility._id,
			department: this.loginEmployee.departmentId,
			units: this.loginEmployee.units
		};
	}

	getForms() {
		try {
			const formType$ = Observable.fromPromise(this.formTypeService.find({ query: { name: 'Documentation' } }));
			formType$
				.mergeMap((formTypes: any) =>
					Observable.fromPromise(
						this.formService.find({
							query: {
								$or: [
									{ selectedFacilityId: this.selectedFacility._id },
									{
										$and: [
											{ departmenId: this.loginEmployee.departmentId },
											{ selectedFacilityId: this.selectedFacility._id }
										]
									},
									{ unitIds: { $in: this.loginEmployee.units } },
									{ personId: this.loginEmployee.personId },
									{ scopeLevelId: VISIBILITY_GLOBAL }
								],
								isSide: false,
								typeOfDocumentId: formTypes.data[0]._id
							}
						})
					)
				)
				.subscribe(
					(results: any) => {
						this.forms = results.data;
					},
					(error) => {
						this.getForms();
					}
				);
		} catch (error) {
			this.getForms();
		}
	}
	checkIfSurveyIsAvailable() {
		this.surveySubscription = Observable.interval(1).takeUntil(this.onDestroy$).subscribe((x) => {
			if (this.selectedForm !== undefined && this.isManual === false) {
				this.setSelectedForm(this.selectedForm);
			} else {
				this.surveyjs.ngOnInit();
				this.surveySubscription.unsubscribe();
			}
		});
	}
	setSelectedForm(form) {
		if (typeof form === 'object' && form !== null) {
			this.selectedForm = form;
			this.showDocument = false;
			this.json = form.body;
			if (this.isEditingPatient === true && this.isManual === false) {
				this.sharedService.announceNewForm({
					json: this.json,
					form: this.selectedForm,
					isManual: this.isManual
				});
			} else {
				this.sharedService.announceNewForm({
					json: this.json,
					form: this.selectedForm,
					isManual: true,
					isEditing: false
				});
			}

			this.showDocument = true;
			if (this.surveyjs !== undefined && this.surveyjs !== null) {
				this.surveyjs.ngOnInit();
				this.surveySubscription.unsubscribe();
				if (this.isEditingPatient === true && this.isManual === false) {
					this.sharedService.announceEditDocumentation({ document: this.editingDocumentation, leg: 1 });
					this.isEditingPatient = false;
					this.isManual = true;
				} else {
					this.editingDocumentation = undefined;
					this.surveyjs.ngOnInit();
					this.surveySubscription.unsubscribe();
					this.checkIfSurveyIsAvailable();
				}

				this.subscription.unsubscribe();
			} else {
				this.subscription.unsubscribe();
			}
			if (this.surveySubscription === undefined) {
				this.checkIfSurveyIsAvailable();
			}
			// this.documentationTemplateService.find({ query: {} });
		} else {
			this.systemModuleService.announceSweetProxy('wow', 'success', null, null, null, null, null, null, null);
		}
	}

	close_onClick() {
		this.closeModal.emit(true);
		this.docSymptom_view = false;
		this.docDiagnosis_view = false;
		this.showOrderSet = false;
	}
	showOrderset_onClick() {
		this.showOrderSet = true;
	}

	filterForms(val: any) {
		return val ? this.forms.filter((s) => s.title.toLowerCase().indexOf(val.toLowerCase()) === 0) : this.forms;
	}

	formDisplayFn(form: any): string {
		return form ? form.title : form;
	}
	docSymptom_show() {
		this.docSymptom_view = true;
	}

	viewOrderset_onClick() {
		this.viewOrderManagement = !this.viewOrderManagement;
	}

	docDiagnosisView() {
		this.viewDiagnosis = !this.viewDiagnosis;
	}

	docDiagnosis_show() {
		this.docDiagnosis_view = true;
	}

	addSymptom(item) {
		if (item.name && item.code) {
			this.symptoms.push(item);
		}
		this.sharedService.announceDiagnosisSystemOrder({ type: 'Symptoms', action: 'add', data: item });
	}

	deleteSymptom(item) {
		this.symptoms = this.symptoms.filter((e) => e !== item);
		this.sharedService.announceDiagnosisSystemOrder({ type: 'Symptoms', action: 'remove', data: item });
	}
	deleteDiagnosis(item) {
		this.diagnoses = this.diagnoses.filter((e) => e !== item);
		this.sharedService.announceDiagnosisSystemOrder({ type: 'ICD 10 Diagnosis', action: 'remove', data: item });
	}

	addDiagnosis(item) {
		if (item.name && item.code) {
			this.diagnoses.push(item);
		}
		this.sharedService.announceDiagnosisSystemOrder({ type: 'ICD 10 Diagnosis', action: 'add', data: item });
	}

	removeDiagnosis(item) {
		this.diagnoses = this.diagnoses.filter((e) => e !== item);
		this.sharedService.announceDiagnosisSystemOrder({ type: 'ICD 10 Diagnosis', action: 'remove', data: item });
	}
	ngOnDestroy() {
		this.surveyjs = undefined;
		if (this.surveySubscription !== undefined) {
			this.onDestroy$.next();
		}
		this.subscription.unsubscribe();
	}
}
