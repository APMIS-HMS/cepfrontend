import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import {
    FacilitiesService, PrescriptionService,
    PrescriptionPriorityService, DictionariesService,
    RouteService, FrequencyService, DrugListApiService, DrugDetailsService, MedicationListService
} from '../../../../../services/facility-manager/setup/index';
import { Appointment, Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import { DurationUnits } from '../../../../../shared-module/helpers/global-config';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-patient-prescription',
    templateUrl: './patient-prescription.component.html',
    styleUrls: ['./patient-prescription.component.scss']
})
export class PatientPrescriptionComponent implements OnInit {
    @Input() employeeDetails: any;
	@Input() patientDetails: any;
    @Input() selectedAppointment: Appointment = <Appointment>{};
    @Output() prescriptionItems: Prescription = <Prescription>{};
    isDispensed: Subject<any> = new Subject();
    facility: Facility = <Facility>{};

    showCuDropdown = false;
    cuDropdownLoading = false;
    addPrescriptionShow = false;
    medicalShow = false;
    mainErr = true;
    errMsg = 'You have unresolved errors';
    addPrescriptionForm: FormGroup;
    allPrescriptionsForm: FormGroup;
    facilityId: string;
    employeeId: string;
    patientId: string;
    priorities: string[] = [];
    prescriptions: Prescription = <Prescription>{};
    prescriptionArray: PrescriptionItem[] = [];
    drugs: string[] = [];
    routes: string[] = [];
    frequencies: string[] = [];
    durationUnits: any[] = [];
    selectedValue: any;
    drugId = '';
    selectedDrugId = '';
    searchText = '';
    refillCount = 0;
    currentDate: Date = new Date();
    minDate: Date = new Date();
    priorityValue: String = '';
    // isDispensed: boolean = false;

    constructor(
        private fb: FormBuilder,
        private _locker: CoolSessionStorage,
        private _el: ElementRef,
        private _route: ActivatedRoute,
        private _facilityService: FacilitiesService,
        private _prescriptionService: PrescriptionService,
        private _priorityService: PrescriptionPriorityService,
        private _dictionaryService: DictionariesService,
        private _frequencyService: FrequencyService,
        private _routeService: RouteService,
        private _drugListApi: DrugListApiService,
        private _drugDetailsApi: DrugDetailsService,
        private _medicationListService: MedicationListService
    ) {

    }

    ngOnInit() {
        this.facility = <Facility>this._locker.getObject('selectedFacility');
        // Remove this when you are done
        this.selectedAppointment.clinicId = '58b700cb636560168c61568d';

        this.prescriptionItems.prescriptionItems = [];
        this.durationUnits = DurationUnits;
        this.selectedValue = DurationUnits[0].name;
        this.getAllPriorities();
        this.getAllRoutes();
        this.getAllFrequencies();
        this.getMedicationList();

        this.allPrescriptionsForm = this.fb.group({
            priority: ['', [<any>Validators.required]],
        });

        this.addPrescriptionForm = this.fb.group({
            strength: ['', [<any>Validators.required]],
            route: ['', [<any>Validators.required]],
            drug: ['', [<any>Validators.required]],
            frequency: ['', [<any>Validators.required]],
            duration: [0, [<any>Validators.required]],
            durationUnit: ['', [<any>Validators.required]],
            refillCount: [this.refillCount],
            startDate: [this.currentDate],
            specialInstruction: ['']
        });
    }

    onClickAddPrescription(value: any, valid: boolean) {
        if (valid) {
            if (this.selectedAppointment.clinicId === undefined) {
                this._facilityService.announceNotification({
                    type: 'Info',
                    text: 'Clinic has not been set!'
                });
            } else {
                const prescriptionItem = <PrescriptionItem>{
                    genericName: value.drug,
                    routeName: value.route,
                    frequency: value.frequency,
                    duration: value.duration + ' ' + value.durationUnit,
                    startDate: value.startDate,
                    strength: value.strength,
                    patientInstruction: (value.specialInstruction == null) ? '' : value.specialInstruction,
                    refillCount: value.refillCount,
                    cost: 0,
                    totalCost: 0,
                    isExternal: false,
                    initiateBill: false,
                    isBilled: false
                };

                this.addPrescriptionShow = true;
                this.prescriptionArray.push(prescriptionItem);

                const prescription = <Prescription>{
                    facilityId: this.facility._id,
                    employeeId: this.employeeDetails._id,
                    clinicId: this.selectedAppointment.clinicId,
                    priorityId: '',
                    patientId: this.patientDetails._id,
                    prescriptionItems: this.prescriptionArray,
                    isAuthorised: true,
                    totalCost: 0,
                    totalQuantity: 0
                };

                console.log(prescription);
                this.prescriptionItems = prescription;
                this.prescriptions = prescription;
                this.addPrescriptionForm.reset();
                this.addPrescriptionForm.controls['refillCount'].reset(0);
                this.addPrescriptionForm.controls['duration'].reset(0);
                this.addPrescriptionForm.controls['startDate'].reset(new Date());
                this.addPrescriptionForm.controls['durationUnit'].reset(this.durationUnits[0].name);
            }
        }
    }

    onClickSavePrescription(value: any, valid: boolean) {
        if (valid && (this.prescriptionArray.length > 0)) {
            if (this.selectedAppointment.clinicId === undefined) {
                this._facilityService.announceNotification({
                    type: 'Info',
                    text: 'Clinic has not been set!'
                });
            } else {
                console.log(value);
                this.prescriptions.priorityId = value.priority;
                this.prescriptions.totalCost = value.totalCost;
                this.prescriptions.totalQuantity = value.totalQuantity;
                this._prescriptionService.create(this.prescriptions)
                    .then(res => {
                        this._facilityService.announceNotification({
                            type: 'Success',
                            text: 'Prescription has been sent!'
                        });
                        this.isDispensed.next(true);
                        this.prescriptionItems = <Prescription>{};
                        this.prescriptionItems.prescriptionItems = [];
                        this.prescriptionArray = [];
                        this.addPrescriptionForm.reset();
                        this.addPrescriptionForm.controls['refillCount'].reset(0);
                        this.addPrescriptionForm.controls['duration'].reset(0);
                        this.addPrescriptionForm.controls['startDate'].reset(new Date());
                        this.addPrescriptionForm.controls['durationUnit'].reset(this.durationUnits[0].name);
                    })
                    .catch(err => {
                        this._facilityService.announceNotification({
                            type: 'Error',
                            text: 'There was an error creating prescription. Please try again later.'
                        });
                        console.log(err);
                    });
            }
        } else {
            this._facilityService.announceNotification({
                type: 'Info',
                text: 'Please select priority for these prescriptions!'
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

    keyupSearch() {
        this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(val => {
            this.searchText = val;
        });

        if (this.searchText.length > 4) {
            this.drugs = [];
            this.cuDropdownLoading = true;
            this._drugListApi.find({ query: { 'searchtext': this.searchText, 'po': false, 'brandonly': false, 'genericonly': true } })
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
        // this._el.nativeElement.getElementsByTagName('input')[0].value = event.srcElement.innerText;
        const productId = drugId.getAttribute('data-drug-id');
        this._drugDetailsApi.find({ query: { 'productId': productId } })
            .then(res => {
                if (res.ingredients.length === 1) {
                    if (res.ingredients[0].strength !== undefined || res.ingredients[0].strengthUnit !== undefined) {
                        this.selectedDrugId = res.ingredients[0].strength + res.ingredients[0].strengthUnit;
                        this.addPrescriptionForm.controls['strength'].setValue(this.selectedDrugId);
                    } else {
                        this.addPrescriptionForm.controls['strength'].setValue('');
                    }

                    if (res.route !== '' || res.route !== undefined) {
                        this.addPrescriptionForm.controls['route'].setValue(res.route);
                    } else {
                        this.addPrescriptionForm.controls['route'].setValue('');
                    }
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    // Get all medications
	getMedicationList() {
		this._medicationListService.find({ query: { facilityId: this.facility._id, patientId: this.patientId }})
			.then(res => {
				console.log(res);
				
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
