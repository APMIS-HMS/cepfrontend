import { Component, OnInit, Input } from '@angular/core';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PersonDocumentation, Document } from '../../../../../models/index';
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

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: Document = <Document>{};
  personDocumentation: Documentation = <Documentation>{};
  documents: Document[] = [];

  constructor(private formService: FormsService, private locker: CoolSessionStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

    this.sharedService.submitForm$.subscribe(payload => {
      const doc: Document = <Document>{};
      doc.document = {
        documentType: this.selectedForm,
        body: payload
      };
      doc.createdBy = this.loginEmployee;
      this.personDocumentation.documentations[0].documents.push(doc);
      this.documentationService.update(this.personDocumentation).then(pay => {
        console.log(pay);
        this.getPersonDocumentation();
      })
    })
  }

  ngOnInit() {
    this.getPersonDocumentation();
  }
  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId._id': this.patient.personId } }).subscribe((payload: any) => {
      if (payload.data.length === 0) {
        this.personDocumentation.personId = this.patient.personDetails
        const pDocumentation: PersonDocumentation = <PersonDocumentation>{};
        pDocumentation.facilityId = this.selectedFacility;
        pDocumentation.patientId = this.patient._id;
        // pDocumentation.documents
        this.personDocumentation.documentations = [];
        this.personDocumentation.documentations.push(pDocumentation);
        this.documentationService.create(this.personDocumentation).subscribe(pload => {
          this.personDocumentation = pload;
          console.log(this.personDocumentation);
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
            this.personDocumentation = mload.data[0];
            this.populateDocuments();
            console.log(this.personDocumentation);
            // mload.data[0].documentations[0].documents.push(doct);
          }
        })
      }

    })
  }
  populateDocuments() {
    this.documents = [];
    this.personDocumentation.documentations.forEach(documentation => {
      documentation.documents.forEach(document => {
        this.documents.push(document);
      });
    });
    this.documents.reverse();
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

  close_onClick(message: boolean): void {
    this.docDetail_view = false;
    this.clinicalNote_view = false;
    this.addProblem_view = false;
    this.addAllergy_view = false;
  }

}
