import { ScopeLevelService } from "app/services/module-manager/setup";
import { AuthFacadeService } from "app/system-modules/service-facade/auth-facade.service";
import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import "rxjs/add/operator/startWith";
import "rxjs/add/operator/map";
import {
  FormsService,
  FacilitiesService,
  DocumentationService
} from "../../../../../../services/facility-manager/setup/index";
import { FormTypeService } from "../../../../../../services/module-manager/setup/index";
import {
  Facility,
  Patient,
  Employee,
  Documentation,
  PatientDocumentation,
  Document
} from "../../../../../../models/index";
import { CoolLocalStorage } from "angular2-cool-storage";
import { Observable } from "rxjs/Observable";
import { SharedService } from "../../../../../../shared-module/shared.service";
import { DocumentationTemplateService } from "app/services/facility-manager/setup/documentation-template.service";
import { SystemModuleService } from "../../../../../../services/module-manager/setup/system-module.service";

@Component({
  selector: "app-clinical-note",
  templateUrl: "./clinical-note.component.html",
  styleUrls: ["./clinical-note.component.scss"]
})
export class ClinicalNoteComponent implements OnInit {
  @Input() patient;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() showOrderset: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild("surveyjs") surveyjs: any;
  json: any;
  selectFormCtrl: FormControl;
  templateFormCtrl: FormControl;
  filteredStates: any;
  filteredForms: any;
  showDocument = false;
  personDocumentation: Documentation = <Documentation>{};
  docSymptom_view = false;
  docDiagnosis_view = false;
  mainErr = true;
  errMsg = "You have unresolved errors";
  states: any[] = [];
  forms: any[] = [];
  documents: Document[] = [];
  templates: any[] = [];
  symptoms: any[] = [];
  diagnoses: any[] = [];
  scopeLevels: any[] = [];
  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  orderSet: any = <any>{};
  showOrderSet = false;
  viewOrderManagement: boolean = false;
  viewDiagnosis: boolean = false;

  constructor(
    private formService: FormsService,
    private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private authFacadeService: AuthFacadeService,
    private formTypeService: FormTypeService,
    private sharedService: SharedService,
    public facilityService: FacilitiesService,
    private scopeLevelService: ScopeLevelService,
    private systemModuleService: SystemModuleService,
    private documentationTemplateService: DocumentationTemplateService
  ) {
    this.authFacadeService
      .getLogingEmployee()
      .then((payload: any) => {
        this.loginEmployee = payload;
        this.getForms();
        this.getTemplates();
      })
      .catch(e => {});

    this.selectFormCtrl = new FormControl();
    this.selectFormCtrl.valueChanges.subscribe(form => {
      this.setSelectedForm(form);
    });

    this.sharedService.submitForm$.subscribe(value => {
      this.symptoms = [];
      this.diagnoses = [];
      this.showDocument = false;
      this.orderSet = {};
    });

    this.templateFormCtrl = new FormControl();
    this.templateFormCtrl.valueChanges.subscribe(temp => {
      // this.surveyjs.surveyModel.data  = temp.data;
      this.sharedService.announceTemplate(temp);
    });

    // this.filteredForms = this.selectFormCtrl.valueChanges
    //   .startWith(null)
    //   .map((form: any) => form && typeof form === 'object' ? this.setSelectedForm(form) : form)
    //   .map(val => val ? this.filterForms(val) : this.forms.slice());
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject("selectedFacility");

    this.sharedService.announceOrderSetSource$.subscribe(value => {
      this.orderSet = value;
      const payload = { type: "OrderSet", action: "add", data: value };
      // Send order set data one after another to the shared service
      this.sharedService.announceDiagnosisSystemOrder(payload);
    });
  }

  private getScopeLevel() {
    this.systemModuleService.on();
    this.scopeLevelService.find({}).then(
      payload => {
        this.scopeLevels = payload.data;
        this.systemModuleService.off();
      },
      error => {
        this.systemModuleService.off();
      }
    );
  }
  getTemplates() {
    this.systemModuleService.on();
    const model = this.makeTemplateModel();
    this.documentationTemplateService
      .find({
        query: {
          $or: [{ facilityId: model.facilityId }, { facilityId: undefined }]
        }
      })
      .then(payload => {
        this.templates = payload.data;
        this.systemModuleService.off();
      })
      .catch(errr => {
        this.systemModuleService.off();
      });
  }

  makeTemplateModel() {
    return {
      facilityId: this.selectedFacility._id,
      department: this.loginEmployee.departmentId,
      units: this.loginEmployee.units
    };
  }

  getForms() {
    const formType$ = Observable.fromPromise(
      this.formTypeService.find({ query: { name: "Documentation" } })
    );
    formType$
      .mergeMap((formTypes: any) =>
        Observable.fromPromise(
          this.formService.find({
            query: {
              facilityId: this.selectedFacility._id,
              typeOfDocumentId: formTypes.data[0]._id
            }
          })
        )
      )
      .subscribe(
        (results: any) => {
          this.forms = results.data;
        },
        error => {
          this.getForms();
        }
      );
  }
  setSelectedForm(form) {
    if (typeof form === "object" && form !== null) {
      this.selectedForm = form;
      this.showDocument = false;
      this.json = form.body;
      this.sharedService.announceNewForm({
        json: this.json,
        form: this.selectedForm
      });
      this.showDocument = true;
      if (this.surveyjs !== undefined) {
        this.surveyjs.ngOnInit();
      }
      this.documentationTemplateService.find({
        query: {}
      });
    }else{
      this.systemModuleService.announceSweetProxy('wow', 'success');
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.docSymptom_view = false;
    this.docDiagnosis_view = false;
    this.showOrderSet = false;
  }
  showOrderset_onClick() {
    this.showOrderSet = true;
  }

  filterForms(val: any) {
    return val
      ? this.forms.filter(
          s => s.title.toLowerCase().indexOf(val.toLowerCase()) === 0
        )
      : this.forms;
  }

  formDisplayFn(form: any): string {
    return form ? form.title : form;
  }
  docSymptom_show() {
    this.docSymptom_view = true;
  }

  viewOrderset_onClick() {
    this.viewOrderManagement = !this.viewOrderManagement;
  }

  docDiagnosisView() {
    this.viewDiagnosis = !this.viewDiagnosis;
  }

  docDiagnosis_show() {
    this.docDiagnosis_view = true;
  }

  addSymptom(item) {
    if (item.name && item.code) {
      this.symptoms.push(item);
    }
    this.sharedService.announceDiagnosisSystemOrder({
      type: "Symptoms",
      action: "add",
      data: item
    });
  }

  deleteSymptom(item) {
    this.symptoms = this.symptoms.filter(e => e !== item);
    this.sharedService.announceDiagnosisSystemOrder({
      type: "Symptoms",
      action: "remove",
      data: item
    });
  }
  deleteDiagnosis(item) {
    this.diagnoses = this.diagnoses.filter(e => e !== item);
    this.sharedService.announceDiagnosisSystemOrder({
      type: "Diagnoses",
      action: "remove",
      data: item
    });
  }

  addDiagnosis(item) {
    if (item.name && item.code) {
      this.diagnoses.push(item);
    }
    this.sharedService.announceDiagnosisSystemOrder({
      type: "Diagnoses",
      action: "add",
      data: item
    });
  }

  removeDiagnosis(item) {
    this.diagnoses = this.diagnoses.filter(e => e !== item);
    this.sharedService.announceDiagnosisSystemOrder({
      type: "Diagnoses",
      action: "remove",
      data: item
    });
  }
}
