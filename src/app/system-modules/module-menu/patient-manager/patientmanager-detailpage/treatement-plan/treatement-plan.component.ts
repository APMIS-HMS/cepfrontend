import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FormsService, FacilitiesService, OrderSetTemplateService, DocumentationService, PersonService, PatientService, TreatmentSheetService
} from 'app/services/facility-manager/setup';
import { OrderSetTemplate, User, Facility } from '../../../../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-treatement-plan',
  templateUrl: './treatement-plan.component.html',
  styleUrls: ['./treatement-plan.component.scss']
})
export class TreatementPlanComponent implements OnInit {
  @Input() patient: any;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  employeeDetails: any = <any>{};
  treatmentSheet: any;
  user: User = <User>{};

  constructor(
    private _route: ActivatedRoute,
    private _locker: CoolLocalStorage,
    private _orderSetTemplateService: OrderSetTemplateService,
    public facilityService: FacilitiesService,
    private _formService: FormsService,
    private _personService: PersonService,
    private _patientService: PatientService,
    private _treatmentSheetService: TreatmentSheetService,
    private _documentationService: DocumentationService,
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');

    this.getTreatmentSheet();
  }

  private getTreatmentSheet() {
    this._treatmentSheetService.find({
      query: { 'personId._id': this.patient.personId }
    }).then(res => {
      console.log(res);
      // this.treatmentSheet = res.data;
      // const o = this.treatmentSheet;
      // const inves = o.investigations === undefined;
      // const med = o.medications === undefined;
      // const nur = o.nursingCares === undefined;
      // const phy = o.physicianOrders === undefined;
      // const pro = o.procedures === undefined;
    }).catch(err => {});
  }
}
