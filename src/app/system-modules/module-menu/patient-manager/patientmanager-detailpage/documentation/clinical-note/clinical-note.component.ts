import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../../shared-module/shared.service';
import { DocumentationTemplateService } from 'app/services/facility-manager/setup/documentation-template.service';


@Component({
  selector: 'app-clinical-note',
  templateUrl: './clinical-note.component.html',
  styleUrls: ['./clinical-note.component.scss']
})
export class ClinicalNoteComponent implements OnInit {
  @Input() patient;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showOrderset: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('surveyjs') surveyjs: any;

  json: any
  selectFormCtrl: FormControl;
  templateFormCtrl: FormControl;
  filteredStates: any;
  filteredForms: any;
  showDocument = false;
  personDocumentation: Documentation = <Documentation>{};
  docSymptom_view = false;
  docDiagnosis_view = false;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  states: any[] = [];
  forms: any[] = [];
  documents: Document[] = [];
  templates: any[] = [];
  symptoms: any[] = [];

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};

  constructor(private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private formTypeService: FormTypeService, private sharedService: SharedService,
    private facilityService: FacilitiesService, private documentationTemplateService: DocumentationTemplateService) {

    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

    this.selectFormCtrl = new FormControl();
    this.selectFormCtrl.valueChanges.subscribe(form => {
      this.setSelectedForm(form)
    })

    this.templateFormCtrl = new FormControl();
    this.templateFormCtrl.valueChanges.subscribe(temp => {
      // this.surveyjs.surveyModel.data  = temp.data;
      this.sharedService.announceTemplate(temp);
    })


    // this.filteredForms = this.selectFormCtrl.valueChanges
    //   .startWith(null)
    //   .map((form: any) => form && typeof form === 'object' ? this.setSelectedForm(form) : form)
    //   .map(val => val ? this.filterForms(val) : this.forms.slice());
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getForms();
    this.getTemplates();
  }
  getTemplates() {
    this.documentationTemplateService.find({}).then(payload => {
      this.templates = payload.data;
    }).catch(errr => {

    })
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
      }, error => {
        this.getForms();
      })
  }
  setSelectedForm(form) {
    this.selectedForm = form;
    this.showDocument = false;
    this.json = form.body;
    this.sharedService.announceNewForm({ json: this.json, form: this.selectedForm });
    this.showDocument = true;
    if (this.surveyjs !== undefined) {
      this.surveyjs.ngOnInit();
    }
    this.documentationTemplateService.find({
      query: {

      }
    })
  }
  close_onClick() {
    this.closeModal.emit(true);
    this.docSymptom_view = false;
    this.docDiagnosis_view = false;
  }
  showOrderset_onClick() {
    this.showOrderset.emit(true);
  }

  filterForms(val: any) {
    return val ? this.forms.filter(s => s.title.toLowerCase().indexOf(val.toLowerCase()) === 0)
      : this.forms;
  }

  formDisplayFn(form: any): string {
    return form ? form.title : form;
  }
  docSymptom_show() {
    this.docSymptom_view = true;
  }

  docDiagnosis_show() {
    this.docDiagnosis_view = true;
  }

  addSymptom(item) {
    this.symptoms.push(item);
    console.log(this.symptoms);
  }

  deleteSymptom(item) {
    this.symptoms = this.symptoms.filter(e => e !== item);
    console.log('delete');
  }

}
