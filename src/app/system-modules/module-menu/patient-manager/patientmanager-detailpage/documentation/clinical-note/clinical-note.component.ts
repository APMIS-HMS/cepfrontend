import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Rx';
import { SharedService } from '../../../../../../shared-module/shared.service';


@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.scss']
})
export class ClinicalNoteComponent implements OnInit {
  @Input() patient;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  json: any
  selectFormCtrl: FormControl;
  filteredStates: any;
  filteredForms: any;
  showDocument = false;
  personDocumentation: Documentation = <Documentation>{};

  mainErr = true;
  errMsg = 'you have unresolved errors';

  states: any[] = [];
  forms: any[] = [];
  documents: Document[] = [];

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};

  constructor(private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService) {

    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

    this.selectFormCtrl = new FormControl();
    this.selectFormCtrl.valueChanges.subscribe(form => {
      this.setSelectedForm(form)
    })


    // this.filteredForms = this.selectFormCtrl.valueChanges
    //   .startWith(null)
    //   .map((form: any) => form && typeof form === 'object' ? this.setSelectedForm(form) : form)
    //   .map(val => val ? this.filterForms(val) : this.forms.slice());
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getForms();
  }
  getForms() {
    const formType$ = Observable.fromPromise(this.formTypeService.find({ query: { name: 'Documentation' } }));
    formType$.mergeMap(((formTypes: any) =>
      Observable.fromPromise(this.formService.find({
        query: {
          $limit: 200, facilityId: this.selectedFacility._id,
          typeOfDocumentId: formTypes.data[0]._id,
          isSide: false
        }
      }))
    ))
      .subscribe((results: any) => {
        this.forms = results.data;
        console.log(this.forms)
      })
  }
  setSelectedForm(form) {
    this.selectedForm = form;
    this.showDocument = false;
    this.json = form.body;
    this.sharedService.announceNewForm({ json: this.json, form: this.selectedForm });
    this.showDocument = true;
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  filterForms(val: any) {
    return val ? this.forms.filter(s => s.title.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.forms;
  }

  formDisplayFn(form: any): string {
    return form ? form.title : form;
  }

}
