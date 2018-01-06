import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
    FacilitiesService, PrescriptionService,
    PrescriptionPriorityService, DictionariesService, BillingService,
    RouteService, FrequencyService, DrugListApiService, DrugDetailsService, MedicationListService, PersonService
} from '../../../../../services/facility-manager/setup/index';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';
import { Appointment, Facility, Employee, Prescription, PrescriptionItem, BillItem, BillIGroup, Dispensed, User }
    from '../../../../../models/index';
import { DurationUnits } from '../../../../../shared-module/helpers/global-config';

@Component({
  selector: "app-template-medication",
  templateUrl: "./template-medication.component.html",
  styleUrls: ["./template-medication.component.scss"]
})
export class TemplateMedicationComponent implements OnInit {
  addPrescriptionForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = "";
  apmisLookupDisplayKey = "";
  apmisLookupText = "";
  currentDate: Date = new Date();
  minDate: Date = new Date();
  newTemplate = true;
  drugs: string[] = [];
  routes: string[] = [];
  frequencies: string[] = [];
  durationUnits: any[] = [];
  selectedDuration: any;
  drugId: string = '';
  refillCount = 0;
  selectedForm = '';
  selectedIngredients: any = [];
  medications: any = [];

  constructor(
    private fb: FormBuilder,
    private _drugListApi: DrugListApiService,
    private _drugDetailsApi: DrugDetailsService,
    private _priorityService: PrescriptionPriorityService,
    private _dictionaryService: DictionariesService,
    private _frequencyService: FrequencyService,
    private _routeService: RouteService,
    private _orderSetSharedService: OrderSetSharedService
  ) {}

  ngOnInit() {
    this.durationUnits = DurationUnits;
    this.selectedDuration = DurationUnits[1].name;

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
    this.apmisLookupUrl = 'drug-generic-list-api';

    this.apmisLookupDisplayKey = 'details';

    this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(value => {
      this.apmisLookupQuery = {
        searchtext: value,
        po: false,
        brandonly: false,
        genericonly: true
      };
    });

    this._getAllFrequencies();
    this._getAllRoutes();
  }

  onClickAddMedication(valid: boolean, value: any) {
    if (valid) {
      const medication = {
        genericName: value.drug,
        routeName: value.route,
        frequency: value.frequency,
        duration: value.duration,
        durationUnit: value.durationUnit,
        startDate: value.startDate,
        strength: value.strength,
        patientInstruction: value.specialInstruction,
        refillCount: value.refillCount,
        ingredients: this.selectedIngredients,
        form: this.selectedForm
      };

      if (this.medications.length > 0) {
        // Check if generic has been added already.
        const containsGeneric = this.medications.filter(
          x => medication.genericName === x.genericName
        );
        if (containsGeneric.length < 1) {
          this.medications.push(medication);
          this._orderSetSharedService.saveItem({ medications: this.medications});
        }
      } else {
        this.medications.push(medication);
        this._orderSetSharedService.saveItem({ medications: this.medications});
      }

      this.addPrescriptionForm.reset();
      this.addPrescriptionForm.controls['refillCount'].reset(0);
      this.addPrescriptionForm.controls['duration'].reset(0);
      this.addPrescriptionForm.controls['startDate'].reset(new Date());
      this.addPrescriptionForm.controls['durationUnit'].reset(
        this.durationUnits[1].name
      );
    }
  }

  apmisLookupHandleSelectedItem(item) {
    this.apmisLookupText = item.details;
    this._drugDetailsApi
      .find({ query: { productId: item.productId } })
      .then(res => {
        let sRes = res.data;
        if (res.status === 'success') {
          console.log(sRes);
          if (!!sRes.ingredients && sRes.ingredients.length > 0) {
            this.selectedForm = sRes.form;
            this.selectedIngredients = sRes.ingredients;
            let drugName: string = sRes.form + ' ';
            let strength = '';
            const ingredientLength: number = sRes.ingredients.length;
            let index = 0;
            sRes.ingredients.forEach(element => {
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
            this.addPrescriptionForm.controls['route'].setValue(sRes.route);
          }
        }
      })
      .catch(err => console.error(err));
  }

  private _getAllRoutes() {
    this._routeService.findAll().then(res => {
        console.log(res);
        this.routes = res.data;
      })
      .catch(err => console.error(err));
  }

  private _getAllFrequencies() {
    this._frequencyService.findAll().then(res => {
        console.log(res);
        this.frequencies = res.data;
      })
      .catch(err => console.error(err));
  }
}
