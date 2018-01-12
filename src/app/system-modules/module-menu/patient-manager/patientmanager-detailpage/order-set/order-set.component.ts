import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FormsService, FacilitiesService, OrderSetTemplateService, DocumentationService, PersonService, PatientService, TreatmentSheetService
} from 'app/services/facility-manager/setup';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';
import { SharedService } from '../../../../../shared-module/shared.service';
import { OrderSetTemplate, User, Facility, Prescription } from '../../../../../models/index';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {
  @Output() showDoc: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedPatient: any;
  prescriptionData: Prescription = <Prescription>{};
  template: FormControl = new FormControl();
  diagnosis: FormControl = new FormControl();
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
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
  showBill= false;
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
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');

    this._route.params.subscribe(value => {
      this._getPatient(value.id);
    });

    // Listen to the event from children components
    this._orderSetSharedService.itemSubject.subscribe(value => {
      console.log(value);
      if (!!value.medications) {
        this.orderSet.medications = value.medications;
      } else if (!!value.investigations) {
        this.orderSet.investigations = value.investigations;
      } else if (!!value.procedures) {
        this.orderSet.procedures = value.procedures;
      } else if (!!value.nursingCares) {
        this.orderSet.nursingCares = value.nursingCares;
      } else if (!!value.physicianOrders) {
        this.orderSet.physicianOrders = value.physicianOrders;
      }

      console.log(this.orderSet);
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
    const treatementSheet = {
      personId: this.selectedPatient.personDetails._id,
      treatmentSheet: this.orderSet,
      facilityId: this.miniFacility._id,
      createdBy: this.employeeDetails.employeeDetails._id,
    };

    this._treatmentSheetService.create(treatementSheet).then(treatment => {
      this.sharedService.announceOrderSet(this.orderSet);
      this.close_onClickModal();
    }).catch(err => {
      console.log(err);
    });
    this.showDoc.emit(true);
  }

  private _getPatient(id) {
    this._patientService.find({query: {
      facilityId: this.miniFacility._id,
      personId: id
    }}).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        this.selectedPatient = res.data[0];
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onClickBillPrescription(index: number, value: any) {
    console.log(value);
    this.prescriptionData.index = index;
    this.prescriptionData.prescriptionItems = this.orderSet.medications;
    this.showBill = true;
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
    this._orderSetTemplateService.find({
      query: { facilityId: this.facility._id }
    }).then(res => {
      if (res.data.length > 0) {
        console.log(JSON.parse(res.data[0].body));
        this.orderSet = JSON.parse(res.data[0].body);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  close_onClick(e) {
    this.popMed = false;
    this.popInvestigation = false;
    this.popNursingCare = false;
    this.popPhysicianOrder = false;
    this.popProcedure = false;
    this.showBill = false;
  }

  close_onClickModal() {
    this.closeModal.emit(true);
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
