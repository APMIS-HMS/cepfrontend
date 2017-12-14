import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../shared-module/shared.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})
export class DocumentationComponent implements OnInit, OnDestroy {
  @Input() patient;
  docDetail_view = false;
  clinicalNote_view = false;
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;

  showDoc = true;
  showOrderSet = false;

  selectedFacility: Facility = <Facility>{};
  selectedMiniFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};
  documents: PatientDocumentation[] = [];

  subscription:Subscription;

  constructor(private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.selectedMiniFacility = <Facility>this.locker.getObject('miniFacility');

    this.subscription = this.sharedService.submitForm$.subscribe(payload => {
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.document = {
        documentType: this.selectedForm,
        body: payload,
      };

      // limit loginEmployee detail
      const logEmp: any = this.loginEmployee;
      delete logEmp.department;
      delete logEmp.employeeFacilityDetails;
      delete logEmp.role;
      delete logEmp.units;
      delete logEmp.consultingRoomCheckIn;
      delete logEmp.storeCheckIn;
      delete logEmp.unitDetails;
      delete logEmp.professionObject;
      delete logEmp.employeeDetails.countryItem;
      delete logEmp.employeeDetails.homeAddress;
      delete logEmp.employeeDetails.gender;
      delete logEmp.employeeDetails.maritalStatus;
      delete logEmp.employeeDetails.nationality;
      delete logEmp.employeeDetails.nationalityObject;
      delete logEmp.employeeDetails.nextOfKin;

      doc.createdBy = logEmp;
      doc.facilityId = this.selectedMiniFacility;
      doc.patientId = this.patient._id;
      console.log(doc);
      this.patientDocumentation.documentations.push(doc);
      console.log(this.patientDocumentation);
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
      }

    })
  }
  populateDocuments() {
    this.documents = [];
    this.patientDocumentation.documentations.forEach(documentation => {
      if ((documentation.document.documentType && documentation.document.documentType.isSide === false)
        || (documentation.document.documentType && documentation.document.documentType.isSide === undefined)) {
        this.documents.push(documentation);
      }
    });
    this.documents.reverse();
  }
  toObject(arr) {
    const rv = {};
    for (let i = 0; i < arr.length; ++i) {
      rv[i] = arr[i];
    }
    return rv;
  }
  analyseObject(object) {
    const props = Object.getOwnPropertyNames(object);
    const docs: any[] = [];
    props.forEach((prop, i) => {
      const property = prop.toString();
      console.log(Object.assign({}, object));
      docs.push({ property: object[prop] });
      // console.log(object[Object.getOwnPropertyNames(object)[1]])
    })


    // console.log(object[Object.getOwnPropertyNames(object)[1]])

    // const arr = Object.keys(object).map(function (k) { return object[k] });
    // const arr = Object.keys(object).map(function(_) { return object[_]; })
    // const obj = JSON.parse(object);
    // console.log(object.split(':'));
    // const splitObject = JSON.stringify(object).split(':'); //.replace('{"', '')
    // console.log(splitObject);
    // console.log(splitObject[1]);
    console.log(docs);
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
  addProblem_show(e) {
    this.addProblem_view = true;
  }
  addAllergy_show(e) {
    this.addAllergy_view = true;
  }
  addHistory_show(e) {
    this.addHistory_view = true;
  }
  addVitals_show(e) {
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

  showOrderset_onClick(e){
    this.showDoc = false;
    this.showOrderSet = true;
  }
  showDoc_onClick(e){
    this.showDoc = true;
    this.showOrderSet = false;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
