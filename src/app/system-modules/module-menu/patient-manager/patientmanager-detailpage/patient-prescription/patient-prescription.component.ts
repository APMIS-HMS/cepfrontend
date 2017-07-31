import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import {
    FacilitiesService, PrescriptionService,
    PrescriptionPriorityService, DictionariesService, BillingService,
    RouteService, FrequencyService, DrugListApiService, DrugDetailsService, MedicationListService
} from '../../../../../services/facility-manager/setup/index';
import { Appointment, Facility, Employee, Prescription, PrescriptionItem, BillItem, BillIGroup, Dispensed } from '../../../../../models/index';
import { DurationUnits } from '../../../../../shared-module/helpers/global-config';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-patient-prescription',
    templateUrl: './patient-prescription.component.html',
    styleUrls: ['./patient-prescription.component.scss']
})
export class PatientPrescriptionComponent implements OnInit {
    @Input() patientDetails: any;
    @Input() selectedAppointment: Appointment = <Appointment>{};
    @Output() prescriptionItems: Prescription = <Prescription>{};
    isDispensed: Subject<any> = new Subject();
    facility: Facility = <Facility>{};
    clinicObj: any = {};
    employeeDetails: any = {};
    user: any = <any>{};

    showCuDropdown: boolean = false;
    cuDropdownLoading: boolean = false;
    addPrescriptionShow: boolean = false;
    currentMedicationShow: boolean = false;
    pastMedicationShow: boolean = false;
    mainErr: boolean = true;
    errMsg: string = 'You have unresolved errors';
    addPrescriptionForm: FormGroup;
    allPrescriptionsForm: FormGroup;
    facilityId: string;
    employeeId: string;
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
    selectedForm: string = '';
    selectedIngredients: any = [];
    currentMedications: any[] = [];
    pastMedications: any[] = [];
    currMedLoading: boolean = false;
    pastMedLoading: boolean = false;
    query = {};
    url = "";

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
        private _billingService: BillingService,
        private _medicationListService: MedicationListService
    ) {

    }

    ngOnInit() {
        this.facility = <Facility>this._locker.getObject('selectedFacility');
        this.user = this._locker.getObject('auth');
        this.employeeDetails = this._locker.getObject('loginEmployee');
        // Remove this when you are done
        this.selectedAppointment.clinicId = '58b700cb636560168c61568d';

        this.prescriptionItems.prescriptionItems = [];
        this.durationUnits = DurationUnits;
        this.selectedValue = DurationUnits[1].name;
        this._getAllPriorities();
        this._getAllRoutes();
        this._getAllFrequencies();

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
        this.url = "drug-generic-list-api";

        this.query = {
                "searchtext": "parace",
                "po": false,
                "brandonly": false,
                "genericonly": true
            }

        this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(value => {
            console.log(value);
            // this.query = {
            //     "searchtext": value,
            //     "po": false,
            //     "brandonly": false,
            //     "genericonly": true
            // }
        })
    }

    onClickAddPrescription(value: any, valid: boolean) {
        if (valid) {
            if (this.selectedAppointment.clinicId === undefined) {
                this._notification('Info', 'Clinic has not been set!');
            } else {
                const dispensed: Dispensed = {
                    totalQtyDispensed: 0,
                    outstandingBalance: 0,
                    dispensedArray: []
                };
                const prescriptionItem = <PrescriptionItem>{
                    genericName: value.drug,
                    routeName: value.route,
                    frequency: value.frequency,
                    duration: value.duration + ' ' + value.durationUnit,
                    startDate: value.startDate,
                    strength: value.strength,
                    patientInstruction: (value.specialInstruction == null) ? '' : value.specialInstruction,
                    refillCount: value.refillCount,
                    ingredients: this.selectedIngredients,
                    form: this.selectedForm,
                    cost: 0,
                    totalCost: 0,
                    isExternal: false,
                    initiateBill: false,
                    isBilled: false,
                    dispensed: dispensed
                };

                this.addPrescriptionShow = true;
                if (this.prescriptions.prescriptionItems !== undefined) {
                    // Check if generic has been added already.
                    const containsGeneric = this.prescriptionArray.filter(x => prescriptionItem.genericName === x.genericName);
                    if (containsGeneric.length < 1) {
                        this.prescriptionArray.push(prescriptionItem);
                    }
                } else {
                    this.prescriptionArray.push(prescriptionItem);
                }

                const prescription = <Prescription>{
                    facilityId: this.facility._id,
                    employeeId: this.employeeDetails._id,
                    clinicId: this.selectedAppointment.clinicId,
                    priorityId: '',
                    patientId: this.patientDetails._id,
                    personId: this.patientDetails.personId,
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

    onClickAuthorizePrescription(value: any, valid: boolean) {
        if (valid && (this.prescriptionArray.length > 0)) {
            if (this.selectedAppointment.clinicId === undefined) {
                this._notification('Info', 'Clinic has not been set!');
            } else {
                this.prescriptions.priorityId = value.priority;
                this.prescriptions.totalCost = value.totalCost;
                this.prescriptions.totalQuantity = value.totalQuantity;

                // bill model
                const billItemArray = [];
                let totalCost = 0;
                this.prescriptions.prescriptionItems.forEach(element => {
                    if (element.isBilled) {
                        const billItem = <BillItem>{
                            facilityServiceId: element.facilityServiceId,
                            serviceId: element.serviceId,
                            facilityId: this.facility._id,
                            patientId: this.prescriptions.patientId,
                            description: element.productName,
                            quantity: element.quantity,
                            totalPrice: element.totalCost,
                            unitPrice: element.cost,
                            unitDiscountedAmount: 0,
                            totalDiscoutedAmount: 0,
                        };

                        totalCost += element.totalCost;
                        billItemArray.push(billItem);
                    }
                });

                const bill = <BillIGroup>{
                    facilityId: this.facility._id,
                    patientId: this.prescriptions.patientId,
                    billItems: billItemArray,
                    discount: 0,
                    subTotal: totalCost,
                    grandTotal: totalCost,
                }
                // If any item was billed, then call the billing service
                if (billItemArray.length > 0) {
                    // send the billed items to the billing service
                    this._billingService.create(bill)
                        .then(res => {
                            console.log(res);
                            if (res._id !== undefined) {
                                this.prescriptions.billId = res._id;
                                // if this is true, send the prescribed drugs to the prescription service
                                this._sendPrescription(this.prescriptions);
                            } else {
                                this._notification('Error', 'There was an error generating bill. Please try again later.');
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    // Else, if no item was billed, just save to the prescription table.
                    this._sendPrescription(this.prescriptions);
                }
            }
        } else {
            this._notification('Info', 'Please select priority for these prescriptions!');
        }
    }

    keyupSearch() {
        this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(val => {
            this.searchText = val;
        });

        if (this.searchText.length > 3) {
            this.drugs = [];
            this.cuDropdownLoading = true;
            this._drugListApi.find({ query: { 'searchtext': this.searchText, 'po': false, 'brandonly': false, 'genericonly': true } })
                .then(res => {
                    console.log(res);
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
                console.log(res);
                if (res.ingredients.length > 0) {
                    this.selectedForm = res.form;
                    this.selectedIngredients = res.ingredients;
                    let drugName: string = res.form + ' ';
                    let strength: string = '';
                    let ingredientLength: number = res.ingredients.length;
                    let index: number = 0;
                    res.ingredients.forEach(element => {
                        index++;
                        drugName += element.name;
                        strength += element.strength + element.strengthUnit;

                        if (index !== ingredientLength) {
                            drugName += '/';
                            strength += '/';
                        }
                    });
                    this.addPrescriptionForm.controls['drug'].setValue(drugName);
                    this.addPrescriptionForm.controls['strength'].setValue(strength);
                    this.addPrescriptionForm.controls['route'].setValue(res.route);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    //Get all medications
    private _getPrescriptionList() {
        this._prescriptionService.find({ query: { facilityId: this.facility._id, patientId: this.patientDetails._id } })
            .then(res => {
                this.currMedLoading = false;
                this.pastMedLoading = false;
                // Bind to current medication list
                const currentMedications = res.data.filter(x => {
                    const lastSevenDays = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
                    if (lastSevenDays < new Date(x.updatedAt)) {
                        return x;
                    }
                });
                this.currentMedications = currentMedications.splice(0, 3);

                // Bind to past medication list
                const pastMedications = res.data.filter(x => {
                    const lastSevenDays = new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000));
                    if (lastSevenDays > new Date(x.updatedAt)) {
                        return x;
                    }
                });
                console.log(pastMedications);
                this.pastMedications = pastMedications.splice(0, 3);
            })
            .catch(err => {
                console.log(err);
            });
    }

    onClickReset() {
        this.addPrescriptionForm.reset();
    }

    private _getAllPriorities() {
        this._priorityService.findAll()
            .then(res => {
                this.priorities = res.data;
                const priority = res.data.filter(x => x.name.toLowerCase().includes('normal'));
                this.allPrescriptionsForm.controls['priority'].setValue(priority[0]._id);
            })
            .catch(err => {
                console.log(err);
            });
    }

    private _getAllRoutes() {
        this._routeService.findAll()
            .then(res => {
                this.routes = res.data;
            })
            .catch(err => {
                console.log(err);
            });
    }

    private _getAllFrequencies() {
        this._frequencyService.findAll()
            .then(res => {
                this.frequencies = res.data;
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

    onClickMedicationShow(value) {
        if ((this.currentMedicationShow === false) && (this.pastMedicationShow === false)) {
            if (value === 'Current') {
                this.currMedLoading = true;
            } else {
                this.pastMedLoading = true;
            }
            this._getPrescriptionList();
        }

        if (value === 'Current') {
            this.currentMedicationShow = !this.currentMedicationShow;
            this.pastMedicationShow = false;
        }

        if (value === 'Past') {
            this.pastMedicationShow = !this.pastMedicationShow;
            this.currentMedicationShow = false;
        }
    }

    private _sendPrescription(data: Prescription): void {
        this._prescriptionService.create(data)
            .then(res => {
                this._notification('Success', 'Prescription has been sent!');
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
                this._notification('Error', 'There was an error creating prescription. Please try again later.');
                console.log(err);
            });
    }

    private _notification(type: string, text: string): void {
        this._facilityService.announceNotification({
            users: [this.user._id],
            type: type,
            text: text
        });
    }
}
