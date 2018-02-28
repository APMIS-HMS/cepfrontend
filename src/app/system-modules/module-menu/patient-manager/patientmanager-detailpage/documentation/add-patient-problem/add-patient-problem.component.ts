import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from './../../../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderStatusService } from '../../../../../../services/module-manager/setup/index';
import { OrderStatus } from '../../../../../../models/index';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../../shared-module/shared.service';

@Component({
  selector: 'app-add-patient-problem',
  templateUrl: './add-patient-problem.component.html',
  styleUrls: ['./add-patient-problem.component.scss']
})
export class AddPatientProblemComponent implements OnInit {
  isSaving: boolean;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient;
  problemFormCtrl: FormControl;
  statusFormCtrl: FormControl;
  noteFormCtrl: FormControl;
  filteredStates: any;
  orderStatuses: any[] = [];

  mainErr = true;
  errMsg = 'you have unresolved errors';
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};


  constructor(private formBuilder: FormBuilder, private orderStatusService: OrderStatusService,
    private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService, private systemModuleService: SystemModuleService,
    private formTypeService: FormTypeService, private sharedService: SharedService, private authFacadeService: AuthFacadeService,
    private facilityService: FacilitiesService) {

    // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.problemFormCtrl = new FormControl();
    this.noteFormCtrl = new FormControl();

    this.statusFormCtrl = new FormControl();
  }

  ngOnInit() {
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
      this.getOrderStatuses();
      this.getPersonDocumentation();
      this.getForm();
    });

  }
  getForm() {
    this.systemModuleService.on();
    Observable.fromPromise(this.formService.find({ query: { title: 'Problems' } }))
      .subscribe((payload: any) => {
        if (payload.data.length > 0) {
          this.selectedForm = payload.data[0];
        }
        this.systemModuleService.off();
      }, error => {
        this.systemModuleService.off();
      });
  }
  getPersonDocumentation() {
    this.systemModuleService.on();
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
          this.systemModuleService.off();
        } else {
          this.documentationService.find({
            query:
              {
                'personId': this.patient.personId, 'documentations.patientId': this.patient._id,
                // $select: ['documentations.documents', 'documentations.facilityId']
              }
          }).subscribe((mload: any) => {
            if (mload.data.length > 0) {
              this.patientDocumentation = mload.data[0];
              this.systemModuleService.off();
            }
          }, error => {
            this.systemModuleService.off();
          })
        }
      }

    })
  }
  getOrderStatuses() {
    this.orderStatuses = [
      {
        _id: 1,
        name: 'Active'
      },
      {
        _id: 2,
        name: 'InActive'
      }
    ];
    // this.systemModuleService.on();
    // this.orderStatusService.findAll().subscribe(payload => {
    //   this.orderStatuses = payload.data;
    //   this.systemModuleService.off();
    // }, error => {
    //   this.systemModuleService.off();
    // });
  }
  close_onClick() {
    this.closeModal.emit(true);
  }


  statusDisplayFn(status: any): string {
    return status ? status.name : status;
  }
  save() {
    this.isSaving = true;
    this.systemModuleService.on();
    let isExisting = false;
    this.patientDocumentation.documentations.forEach(documentation => {
      if (documentation.document === undefined) {
        documentation.document = {
          documentType: {}
        }
      }
      if (documentation.document.documentType._id !== undefined &&
        documentation.document.documentType._id === this.selectedForm._id) {
        isExisting = true;
        documentation.document.body.problems.push({
          problem: this.problemFormCtrl.value,
          status: this.statusFormCtrl.value,
          note: this.noteFormCtrl.value,
        })
      }
    });
    if (!isExisting) {
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.createdBy = this.loginEmployee.personDetails.title + ' ' + this.loginEmployee.personDetails.lastName + ' ' + this.loginEmployee.personDetails.firstName;
      doc.facilityId = this.selectedFacility._id;
      doc.facilityName = this.selectedFacility.name;
      doc.patientId = this.patient._id,
      doc.patientName = this.patient.personDetails.title + ' ' + this.patient.personDetails.lastName + ' ' + this.patient.personDetails.firstName;
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
      this.isSaving = false;
      this.patientDocumentation = payload;
      this.problemFormCtrl.reset();
      this.statusFormCtrl.reset();
      this.noteFormCtrl.reset();
      this.documentationService.announceDocumentation({ type: 'Problem' });
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Problem added successfully!', 'success', null, null, null, null, null, null, null);
    }, error => {
      this.isSaving = false;
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Problem not added due error while saving!','error');
    })
  }
}
