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
  treatmentSheetData: any;
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
    // console.log(this.patient,this.miniFacility);
    this._treatmentSheetService.find({
      query: {
        personId: this.patient.personId,
        facilityId: this.selectedFacility._id,
        completed: false,
        $sort: { createdAt: -1 }
      }
    }).then(res => {
      // console.log(this.patient,this.miniFacility);
      if (res.data.length > 0) {
        this.treatmentSheetData = res.data[0];
        this.treatmentSheet = res.data[0].treatmentSheet;
        console.log(this.treatmentSheet);
      }
    }).catch(err => { });
  }

  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId': this.patient.personId } }).subscribe((payload: any) => {
      if (payload.data.length === 0) {
        this.patientDocumentation.personId = this.patient.personDetails;
        this.patientDocumentation.documentations = [];
        this.documentationService.create(this.patientDocumentation).subscribe(pload => {
          this.patientDocumentation = pload;
        })
      } else {
        if (payload.data[0].documentations.length === 0) {
          this.patientDocumentation = payload.data[0];
        } else {
          this.documentationService.find({
            query:
            {
              'personId': this.patient.personId, 'documentations.patientId': this.patient._id,
            }
          }).subscribe((mload: any) => {
            if (mload.data.length > 0) {
              this.patientDocumentation = mload.data[0];
            }
          })
        }
      }

    })
  }
  save(nursingCare) {
    this.isSaving = true;

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
        Done: 'By ' + this.loginEmployee.employeeDetails.lastName + ' ' + this.loginEmployee.employeeDetails.firstName +
          ' at ' + new Date().toLocaleString(),
        'comment': nursingCare.comment
      }
    }

    this.patientDocumentation.documentations.push(doc);
    this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      nursingCare.comment = '';
      this.patientDocumentation = payload;
      this.documentationService.announceDocumentation({ type: 'Allergies' });
      this.isSaving = false;
    }, error => {
      this.isSaving = false;
    });
  }
  administer(medication, index) {
    medication.staus = 'Started';
    const doc: PatientDocumentation = <PatientDocumentation>{};
    doc.facilityId = this.selectedFacility;
    doc.createdBy = this.loginEmployee;
    doc.patientId = this.patient._id;
    doc.document = {
      documentType: {
        facilityId: this.selectedFacility._id,
        isSide: false,
        title: 'Medication Order'
      },
      body: {
        'Doctor Instruction': 'Give ' + medication.genericName + ' ' + medication.form + ' '
          + medication.frequency + ' for ' + medication.duration + ' ' + medication.durationUnit,
        Done: 'By ' + this.loginEmployee.employeeDetails.lastName + ' ' + this.loginEmployee.employeeDetails.firstName +
          ' at ' + new Date().toLocaleString(),
        'comment': medication.comment
      }
    }

    this.patientDocumentation.documentations.push(doc);
    this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      medication.comment = '';
      this.patientDocumentation = payload;
      this.documentationService.announceDocumentation({ type: 'Allergies' });
      this.isSaving = false;
      this._updateTreatmentSheet(medication, index);
    }, error => {
      this.isSaving = false;
    });
  }

  _updateTreatmentSheet(medication, index) {
    this.isSaving = true;
    const medicationObj = this.treatmentSheet.medications[index];
    medicationObj.status = 'Started';
    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    });
  }

  completeMedication(medication, index) {
    const medicationObj = this.treatmentSheet.medications[index];
    this.isSaving = true;
    medicationObj.status = 'Completed';
    medicationObj.completed = true;

    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    });
  }
  discontinueMedication(medication, index) {
    const medicationObj = this.treatmentSheet.medications[index];
    this.isSaving = true;
    medicationObj.status = 'Discontinued';
    medicationObj.completed = true;

    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    })
  }
  suspendMedication(medication, index) {
    const medicationObj = this.treatmentSheet.medications[index];
    this.isSaving = true;
    medicationObj.status = 'Suspended';
    medicationObj.completed = true;

    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    })
  }
  activateMedication(medication, index) {
    const medicationObj = this.treatmentSheet.medications[index];
    this.isSaving = true;
    medicationObj.status = 'Started';
    medicationObj.completed = true;

    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    });
  }
}
