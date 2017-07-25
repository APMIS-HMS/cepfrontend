import { Component, OnInit, Input } from '@angular/core';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation } from '../../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Rx';
import { SharedService } from '../../../../../shared-module/shared.service';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit {
  @Input() patient;
  docDetail_view = false;
  clinicalNote_view = false;
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};
  documents: PatientDocumentation[] = [];

  constructor(private formService: FormsService, private locker: CoolSessionStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');

    this.sharedService.submitForm$.subscribe(payload => {
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.document = {
        documentType: this.selectedForm,
        body: payload,
      };
      doc.createdBy = this.loginEmployee;
      doc.facilityId = this.selectedFacility;
      doc.patientId = this.patient._id;
      console.log(doc);
      this.patientDocumentation.documentations.push(doc);
      this.documentationService.update(this.patientDocumentation).then(pay => {
        console.log(pay);
        this.getPersonDocumentation();
      })
    });
    this.sharedService.newFormAnnounced$.subscribe((payload: any) => {
      this.selectedForm = payload.form;
    })
  }

  ngOnInit() {
    this.getPersonDocumentation();
  }
  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId._id': this.patient.personId } }).subscribe((payload: any) => {
      if (payload.data.length === 0) {
        this.patientDocumentation.personId = this.patient.personDetails;
        this.patientDocumentation.documentations = [];
        // const pDocumentation: PatientDocumentation = <PatientDocumentation>{};
        // pDocumentation.facilityId = this.selectedFacility;
        // pDocumentation.patientId = this.patient._id;

        // this.patientDocumentation.documentations = [];
        // this.patientDocumentation.documentations.push(pDocumentation);
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
            this.populateDocuments();
            console.log(this.patientDocumentation);
            // mload.data[0].documentations[0].documents.push(doct);
          }
        })
      }

    })
  }
  populateDocuments() {
    this.documents = [];
    this.patientDocumentation.documentations.forEach(documentation => {
      this.documents.push(documentation);
    });
    this.documents.reverse();
  }
  analyseObject(object) {
    // console.log(Object.getOwnPropertyNames(object));
    // const arr = Object.keys(object).map(function (k) { return object[k] });
    // const arr = Object.keys(object).map(function(_) { return object[_]; })
    // const obj = JSON.parse(object);
    // console.log(object.split(':'));
    const splitObject = JSON.stringify(object).split(':'); //.replace('{"', '')
    console.log(this.trimValue(splitObject[1]));
    // console.log(splitObject[1]);
    return object;
  }
  trimKey(value) {
    const init = value.replace('{"', '');
    return init.replace('"', '');
  }
  trimValue(value) {
    const init = value.replace('"', '');
    return init.replace('"}', '');
  }
  docDetail_show(document) {
    this.selectedDocument = document;
    this.docDetail_view = true;
  }
  clinicalNote_show() {
    this.clinicalNote_view = !this.clinicalNote_view;
  }
  addProblem_show() {
    this.addProblem_view = true;
  }
  addAllergy_show() {
    this.addAllergy_view = true;
  }
  addHistory_show() {
    this.addHistory_view = true;
  }
  addVitals_show() {
    this.addVitals_view = true;
  }

  close_onClick(message: boolean): void {
    this.docDetail_view = false;
    this.clinicalNote_view = false;
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }

}
