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
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {
  @Output() showDoc: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedPatient: any;
  prescriptionData: Prescription = <Prescription>{};
  investigationData: any = <any>{};
  template: FormControl = new FormControl();
  diagnosis: FormControl = new FormControl();
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
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
    private _authFacadeService: AuthFacadeService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.employeeDetails = res;
    });
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    this._route.params.subscribe(value => {
      this._getPatient(value.id);
    });

    // Listen to the event from children components
    this._orderSetSharedService.itemSubject.subscribe(value => {
      if (!!value.medications) {
        if (!!this.orderSet.medications) {
          const findItem = this.orderSet.medications
            .filter(x => x.genericName === value.medications[0].genericName && x.strength === value.medications[0].strength);
          if (findItem.length === 0) {
            this.orderSet.medications.push(value.medications[0]);
          }
        } else {
          this.orderSet.medications = value.medications;
        }
      } else if (!!value.investigations) {
        if (!!this.orderSet.investigations) {
          const findItem = this.orderSet.investigations.filter(x => x._id === value.investigations[0]._id);
          if (findItem.length === 0) {
            this.orderSet.investigations.push(value.investigations[0]);
          }
        } else {
          this.orderSet.investigations = value.investigations;
        }
      } else if (!!value.procedures) {
        if (!!this.orderSet.procedures) {
          const findItem = this.orderSet.procedures.filter(x => x._id === value.procedures[0]._id);
          if (findItem.length === 0) {
            this.orderSet.procedures.push(value.procedures[0]);
          }
        } else {
          this.orderSet.procedures = value.procedures;
        }
      } else if (!!value.nursingCares) {
        if (!!this.orderSet.nursingCares) {
          const findItem = this.orderSet.nursingCares.filter(x => x.name === value.nursingCares[0].name);
          if (findItem.length === 0) {
            this.orderSet.nursingCares.push(value.nursingCares[0]);
          }
        } else {
          this.orderSet.nursingCares = value.nursingCares;
        }
      } else if (!!value.physicianOrders) {
        if (!!this.orderSet.physicianOrders) {
          const findItem = this.orderSet.physicianOrders.filter(x => x.name === value.physicianOrders[0].name);
          if (findItem.length === 0) {
            this.orderSet.physicianOrders.push(value.physicianOrders[0]);
          }
        } else {
          this.orderSet.physicianOrders = value.physicianOrders;
        }
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
    const treatementSheet = {
      personId: this.selectedPatient.personDetails._id,
      treatmentSheet: this.orderSet,
      facilityId: this.facility._id,
      createdBy: this.employeeDetails._id,
    };

    this._treatmentSheetService.setTreatmentSheet(treatementSheet).then(treatment => {
      console.log(treatment);
      this.sharedService.announceOrderSet(this.orderSet);
      this.close_onClickModal();
    }).catch(err => {
      console.log(err);
      // this.sharedService.announceOrderSet(this.orderSet);
      // this.close_onClickModal();
     });
    this.showDoc.emit(true);
  }

  deleteOrderSetItem(index: number, value: any, type: string) {
    if (type === 'medication') {
      const findItem = this.orderSet.medications.filter(x => x.genericName === value.genericName && x.strength === value.strength);

      if (findItem.length > 0) {
        this.orderSet.medications.splice(index, 1);
      }
    } else if (type === 'investigation') {
      const findItem = this.orderSet.investigations.filter(x => x._id === value._id);

      if (findItem.length > 0) {
        this.orderSet.investigations.splice(index, 1);
      }
    } else if (type === 'procedure') {
      const findItem = this.orderSet.procedures.filter(x => x._id === value._id);

      if (findItem.length > 0) {
        this.orderSet.procedures.splice(index, 1);
      }
    } else if (type === 'nursingCare') {
      const findItem = this.orderSet.nursingCares.filter(x => x.name === value.name);

      if (findItem.length > 0) {
        this.orderSet.nursingCares.splice(index, 1);
      }
    } else if (type === 'physicianOrder') {
      const findItem = this.orderSet.physicianOrders.filter(x => x.name === value.name);

      if (findItem.length > 0) {
        this.orderSet.physicianOrders.splice(index, 1);
      }
    }
  }

  private _getPatient(id) {
    this._patientService.find({
      query: {
        facilityId: this.miniFacility._id,
        personId: id
      }
    }).then(res => {
      if (res.data.length > 0) {
        this.selectedPatient = res.data[0];
      }
    }).catch(err => {
    });
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
    this._orderSetTemplateService.find({
      query: { facilityId: this.facility._id }
    }).then(res => {
      if (res.data.length > 0) {
        this.orderSet = JSON.parse(res.data[0].body);
      }
    }).catch(err => {
    });
  }

  close_onClick(e) {
    this.popMed = false;
    this.popInvestigation = false;
    this.popNursingCare = false;
    this.popPhysicianOrder = false;
    this.popProcedure = false;
    this.showMedicationBill = false;
    this.showInvestigationBill = false;
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
