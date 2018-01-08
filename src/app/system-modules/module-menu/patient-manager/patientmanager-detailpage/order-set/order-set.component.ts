import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FormsService, FacilitiesService, OrderSetTemplateService, DocumentationService, PersonService, PatientService, TreatmentSheetService
} from 'app/services/facility-manager/setup';
import { OrderSetTemplate, User, Facility } from '../../../../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-set',
  templateUrl: './order-set.component.html',
  styleUrls: ['./order-set.component.scss']
})
export class OrderSetComponent implements OnInit {
  @Output() showDoc: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedPatient: any;
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
  showbill= false;
  user: any = <any>{};
  orderSet: any = <any>{};
  selectedForm: any;

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

    this._route.params.subscribe(value => {
      this._getPatient(value.id);
    });

    this._getDocumentationForm();
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

  close_onClick(e){
    this.popMed = false;
    this.popInvestigation = false;
    this.popNursingCare = false;
    this.popPhysicianOrder = false;
    this.popProcedure = false;
    this.showbill = false;
  }

  authorizerx() {
    if (!!this.selectedForm._id) {
      // Send to treatment sheet and Documentation
      const saveDocument = {
        documentType: this.selectedForm,
        body: {}
      };

      Object.keys(this.orderSet).forEach(key => {
        // I'm doing this because the data structure for medications is quite different.
        if (key === 'medications') {
          this.orderSet[key].forEach((it, i) => {
            const length = this.orderSet[key].length - 1;
            if (i === 0) {
              saveDocument.body[key] = (i+1) +'. '+it.strength+' '+it.genericName+' - '+it.frequency+' for '+ it.duration+' ' +it.durationUnit+ ', ';
            } else {
              if (length === i) {
                saveDocument.body[key] += (i+1) +'. '+it.strength+' '+it.genericName+' - '+it.frequency+' for '+ it.duration+' ' +it.durationUnit;
              } else {
                saveDocument.body[key] += (i+1) +'. '+it.strength+' '+it.genericName+' - '+it.frequency+' for '+ it.duration+' '+it.durationUnit+ ', ';
              }
            }
          });
        } else {
          this.orderSet[key].forEach((item, i) => {
            const length = this.orderSet[key].length - 1;
            if (i === 0) {
              saveDocument.body[key] = (i + 1) + '. ' + item.name +  ', ';
            } else {
              if (length === i) {
                saveDocument.body[key] += ( i + 1) + '. ' + item.name;
              } else {
                saveDocument.body[key] += (i + 1) + '. ' + item.name +  ', ';
              }
            }
          });
        }
      });

      const patientDocumentation = {
        document: saveDocument,
        createdBy: this.employeeDetails.employeeDetails._id,
        facilityId: this.miniFacility,
        patientId: this._patientService.abridgePatient(this.selectedPatient),
      };

      const documentation = {
        personId: this._personService.abridgePerson(this.selectedPatient.personDetails),
        documentations: patientDocumentation,
      };

      // Check if documentation has been created for the user
      this._documentationService.find({
        query: { 'personId._id': this.selectedPatient.personDetails._id }
      }).then(res => {
        if (res.data.length > 0) {
          res.data[0].documentations.push(patientDocumentation);
          // Update the existing documentation
          this._documentationService.update(res.data[0]).then(resUpdate => {
            this._notification('Success', 'Treatment Plan has been saved successfully!');
          });
        } else {
          // Save into documentation
          this._documentationService.create(documentation).then(resCreate => {
            this._notification('Success', 'Treatment Plan has been saved and uploaded successfully!');
          });
        }

        /**
         * Treatment Sheet
         */
        const patientTreatmentSheet = {
          document: this.orderSet,
          createdBy: this.employeeDetails.employeeDetails._id,
          facilityId: this.miniFacility,
          patientId: this._patientService.abridgePatient(this.selectedPatient),
        };

        const treatementSheet = {
          personId: this._personService.abridgePerson(this.selectedPatient.personDetails),
          treatmentSheets: patientTreatmentSheet,
        };

        this._treatmentSheetService.create(treatementSheet).then(treatment => {
          console.log(treatment);
        }).catch(err => {
          console.log(err);
        });
      }).catch(err => {
        console.log(err);
      });
    } else {
      this._notification('Error', 'Please create document type of \'Treatment Plan\'');
    }

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

  showbill_click(){
    this.showbill = true;
  }

  apmisLookupHandleSelectedItem(value: any) {
    this.apmisLookupText = value.name;
    this.diagnosis.setValue('');
    this.template.setValue(value.name);
    this.orderSet = JSON.parse(value.body);
    console.log(this.orderSet);
    console.log(value);
  }

  apmisDLookupHandleSelectedItem(value: any) {
    this.apmisDLookupText = value.name;
    this.template.setValue('');
    this.diagnosis.setValue(value.diagnosis);
    this.orderSet = JSON.parse(value.body);
    console.log(value);
  }

  private _getDocumentationForm() {
    this._formService.findAll().then(res => {
      console.log(res);
      const selectedForm = res.data.filter(x => new RegExp('Treatment Plan', 'i').test(x.title));
      if (selectedForm.length > 0) {
        this.selectedForm = selectedForm[0];
      } else {
        this._notification('Error', 'Please create document type of \'Treatment Plan\'');
      }
      console.log(this.selectedForm);
    }).catch(err => this._notification('Error', 'There was a problem getting documentations!'));
  }

  private _getOrderSetTemplate() {
    this._orderSetTemplateService.find({
      query: { facilityId: this.facility._id }
    }).then(res => {
      console.log(res);
      if (res.data.length > 0) {
        console.log(JSON.parse(res.data[0].body));
        this.orderSet = JSON.parse(res.data[0].body);
      }
    }).catch(err => {
      console.log(err);
    });
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
