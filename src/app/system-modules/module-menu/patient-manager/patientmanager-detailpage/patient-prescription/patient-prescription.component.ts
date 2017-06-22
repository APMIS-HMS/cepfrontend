import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FacilitiesService, PrescriptionService,
  PrescriptionPriorityService, DictionariesService,
  RouteService, FrequencyService, DrugListApiService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import { drugWeight } from '../../../../../shared-module/helpers/global-config';
import 'devextreme-intl';

@Component({
  selector: 'app-patient-prescription',
  templateUrl: './patient-prescription.component.html',
  styleUrls: ['./patient-prescription.component.scss']
})
export class PatientPrescriptionComponent implements OnInit {
  @Input() employeeDetails: any;
  facility: Facility = <Facility>{};
  now: Date = new Date();
  showCuDropdown = false;
  cuDropdownLoading = false;
  billShow = false;
  billShowId = 0;
  medicalShow = false;
  mainErr = true;
  errMsg = 'You have unresolved errors';
  addPrescriptionForm: FormGroup;
  facilityId: string;
  employeeId: string;
  patientId: string;
  priorities: string[] = [];
  prescriptions: Prescription = <Prescription>{};
  prescriptionItems: PrescriptionItem[] = [];
  drugs: string[] = [];
  routes: string[] = [];
  frequencies: string[] = [];
  drugWeight: any[] = [];
  selectedValue: any;

  constructor(
    private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _el: ElementRef,
    private _route: ActivatedRoute,
    private _facilityService: FacilitiesService,
    private _prescriptionService: PrescriptionService,
    private _priorityService: PrescriptionPriorityService,
    private _dictionaryService: DictionariesService,
    private _frequencyService: FrequencyService,
    private _routeService: RouteService,
    private _drugListApi: DrugListApiService
  ) {

  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this._route.params.subscribe(params => {
      this.patientId = params['id'];
    });

    // let inputWidth = this._el.nativeElement.getElementsByClassName('cu-search')[0].clientWidth;
    // //this.popupWidth = inputWidth / 2;
    // this.popupWidth = 50;

    this.drugWeight = drugWeight;
    this.selectedValue = drugWeight[0].name;
    this.getAllDrugs();
    this.getAllPriorities();
    this.getAllRoutes();
    this.getAllFrequencies();

    this.addPrescriptionForm = this.fb.group({
      strength: ['', [<any>Validators.required]],
      strengthWeight: ['', [<any>Validators.required]],
      route: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      frequency: ['', [<any>Validators.required]],
      duration: ['', [<any>Validators.required]],
      priority: ['', [<any>Validators.required]],
      refillCount: [''],
      startDate: [''],
      substitution: [''],
      specialInstruction: ['']
    });
  }

  onClickAddPrescription(value: any, valid: boolean) {
    if (valid) {
      const prescriptionItem = <PrescriptionItem>{
        genericName: value.drug,
        routeName: value.route,
        frequency: value.frequency,
        duration: value.duration,
        strength: value.strength + value.strengthWeight,
        patientInstruction: value.specialInstruction,
        priorityId: value.priority,
        refillCount: value.refillCount,
        isRefill: value.refillCount > 0 ? true : false,
      };

      let length = this.prescriptionItems.length;

      if (value.id === undefined) {
        prescriptionItem.id = ++length;
      } else {
        prescriptionItem.id = value.id;
      }

      this.prescriptionItems.push(prescriptionItem);

      const prescription = <Prescription>{
        facilityId: this.facility._id,
        employeeId: this.employeeDetails.employeeDetails._id,
        patientId: this.patientId,
        prescriptionItems: this.prescriptionItems,
        isAuthorised: true
      };

      this.prescriptions = prescription;
      // this.addPrescriptionForm.reset();
    }
  }

  onClickSavePrescription() {
    this._prescriptionService.create(this.prescriptions)
      .then(res => {
        this._facilityService.announceNotification({
          type: 'Success',
          text: 'Prescription has been added!'
        });
        this.prescriptionItems = [];
        this.addPrescriptionForm.reset();
      })
      .catch(err => {
        console.log(err);
      });
  }

  onClickDeleteItem(value: any) {
    this.prescriptions.prescriptionItems.splice(value, 1);
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
  getAllDrugs() {
    this._dictionaryService.findAll()
      .then(res => {
        this.drugs = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }

  keyupSearch() {
    this.drugs = [];
    this.cuDropdownLoading = true;
    this._drugListApi.find({ 'searchtext': '', 'po': false, 'brandonly': false, 'genericonly': false })
      .then(res => {
        this.cuDropdownLoading = false;
        this.drugs = res.data;
      })
      .catch(err => {
        this.cuDropdownLoading = false;
        console.log(err);
      });
  }

  onClickCustomSearchItem(event) {
    this._el.nativeElement.getElementsByTagName('input')[0].value = event.srcElement.innerText;
  }

  focusSearch() {
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch() {
    setTimeout(() => {
      this.showCuDropdown = !this.showCuDropdown;
    }, 300);
  }

  toggleBill(index) {
    this.billShow = !this.billShow;
    this.billShowId = index;
  }
  togglemedicalShow() {
    this.medicalShow = !this.medicalShow;
  }
}
