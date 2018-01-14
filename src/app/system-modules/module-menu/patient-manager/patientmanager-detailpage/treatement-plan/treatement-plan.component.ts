import { Employee } from './../../../../../models/facility-manager/setup/employee';
import { Documentation } from './../../../../../models/facility-manager/setup/documentation';
import { PatientDocumentation } from './../../../../../models/facility-manager/setup/patient-documentation';
import { Observable } from 'rxjs/Observable';
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
  isSaving: boolean;
  @Input() patient: any;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  employeeDetails: any = <any>{};
  treatmentSheet: any = <any>{};
  user: User = <User>{};

  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};

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
    private documentationService: DocumentationService,
    private locker: CoolLocalStorage
  ) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');

    this.getTreatmentSheet();
    this.getPersonDocumentation();
  }

  private getTreatmentSheet() {
    this._treatmentSheetService.find({
      query: {
        personId: this.patient.personId,
        facilityId: this.miniFacility._id,
        completed: false,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      if (res.data.length > 0) {
        this.treatmentSheet = res.data[0].treatmentSheet;
      }
    }).catch(err => { });
  }

  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId._id': this.patient.personId } }).subscribe((payload: any) => {
      if (payload.data.length === 0) {
        this.patientDocumentation.personId = this.patient.personDetails;
        this.patientDocumentation.documentations = [];
        this.documentationService.create(this.patientDocumentation).subscribe(pload => {
          this.patientDocumentation = pload;
          console.log(this.patientDocumentation);
        })
      } else {
        if (payload.data[0].documentations.length === 0) {
          this.patientDocumentation = payload.data[0];
          console.log(this.patientDocumentation);
        } else {
          this.documentationService.find({
            query:
              {
                'personId._id': this.patient.personId, 'documentations.patientId': this.patient._id,
              }
          }).subscribe((mload: any) => {
            if (mload.data.length > 0) {
              this.patientDocumentation = mload.data[0];
              console.log(this.patientDocumentation);
            }
          })
        }
      }

    })
  }
  save(nursingCare) {
    this.isSaving = true;
    if (true) {
      console.log(nursingCare);
      console.log(this.loginEmployee);
      console.log(this.selectedFacility);


      // documentType:{
      //   facilityId:
      //   isSide:false
      //   title:'Nursing Care'
      //   }

      //   body:{
      //   'Nursing Care': value,
      //   Action:Done on dateandtime,
      //   'comment':value
      //   }



      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.facilityId = this.selectedFacility;
      doc.createdBy = this.loginEmployee;
      doc.patientId = this.patient._id;
      doc.document = {
        documentType: {
          facilityId: this.selectedFacility._id,
          isSide: false,
          title: 'Nursing Care'
        },
        body: {
          'Nursing Care': nursingCare.name,
          Done: new Date().toLocaleString('en_NG'),
          'comment': nursingCare.comment
        }
      }

      this.patientDocumentation.documentations.push(doc);
    }
    console.log(this.patientDocumentation.documentations)
    this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      nursingCare.comment = '';
      this.patientDocumentation = payload;
      this.documentationService.announceDocumentation({ type: 'Allergies' });
      this.isSaving = false;
    }, error => {
      this.isSaving = false;
    });
  }
}
