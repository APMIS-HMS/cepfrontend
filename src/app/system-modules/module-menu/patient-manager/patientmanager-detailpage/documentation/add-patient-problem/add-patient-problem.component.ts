import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderStatusService } from '../../../../../../services/module-manager/setup/index';
import { OrderStatus } from '../../../../../../models/index';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Rx';
import { SharedService } from '../../../../../../shared-module/shared.service';

@Component({
  selector: 'app-add-patient-problem',
  templateUrl: './add-patient-problem.component.html',
  styleUrls: ['./add-patient-problem.component.scss']
})
export class AddPatientProblemComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient;
  problemFormCtrl: FormControl;
  statusFormCtrl: FormControl;
  noteFormCtrl: FormControl;
  filteredStates: any;
  orderStatuses: OrderStatus[] = [];

  mainErr = true;
  errMsg = 'you have unresolved errors';


  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};


  constructor(private formBuilder: FormBuilder, private orderStatusService: OrderStatusService,
    private formService: FormsService, private locker: CoolSessionStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService) {

    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.problemFormCtrl = new FormControl();
    this.noteFormCtrl = new FormControl();

    this.statusFormCtrl = new FormControl();
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getOrderStatuses();
    this.getPersonDocumentation();
    this.getForm();
  }
  getForm() {
    Observable.fromPromise(this.formService.find({ query: { title: 'Problems' } }))
      .subscribe((payload: any) => {
        if (payload.data.length > 0) {
          this.selectedForm = payload.data[0];
        }
      });
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
        this.documentationService.find({
          query:
          {
            'personId._id': this.patient.personId, 'documentations.patientId': this.patient._id,
            // $select: ['documentations.documents', 'documentations.facilityId']
          }
        }).subscribe((mload: any) => {
          if (mload.data.length > 0) {
            this.patientDocumentation = mload.data[0];
            // this.populateDocuments();
            console.log(this.patientDocumentation);
            // mload.data[0].documentations[0].documents.push(doct);
          }
        })
      }

    })
  }
  getOrderStatuses() {
    this.orderStatusService.findAll().subscribe(payload => {
      this.orderStatuses = payload.data;
    });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }


  statusDisplayFn(status: any): string {
    return status ? status.name : status;
  }
  save() {
    let isExisting = false;
    this.patientDocumentation.documentations.forEach(documentation => {
      if (documentation.document.documentType._id === this.selectedForm._id) {
        isExisting = true;
        documentation.document.body.problems.push({
          problem: this.problemFormCtrl.value,
          status: this.statusFormCtrl.value,
          note: this.noteFormCtrl.value
        })
      }
    });
    if (!isExisting) {
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.facilityId = this.selectedFacility;
      doc.createdBy = this.loginEmployee;
      doc.patientId = this.patient._id;
      doc.document = {
        documentType: this.selectedForm,
        body: {
          problems: []
        }
      }
      doc.document.body.problems.push({
        problem: this.problemFormCtrl.value,
        status: this.statusFormCtrl.value,
        note: this.noteFormCtrl.value
      });
      this.patientDocumentation.documentations.push(doc);
    }
    this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      this.patientDocumentation = payload;
      this.problemFormCtrl.reset();
      this.statusFormCtrl.reset();
      this.noteFormCtrl.reset();
    })
  }
}
