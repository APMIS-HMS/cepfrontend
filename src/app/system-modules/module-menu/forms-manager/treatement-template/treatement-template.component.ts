import { DocumentationTemplateService } from './../../../../services/facility-manager/setup/documentation-template.service';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ScopeLevelService, FormTypeService } from 'app/services/module-manager/setup';
import { Observable } from 'rxjs/Observable';
import { FormsService } from 'app/services/facility-manager/setup';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SharedService } from 'app/shared-module/shared.service';

@Component({
  selector: 'app-treatement-template',
  templateUrl: './treatement-template.component.html',
  styleUrls: ['./treatement-template.component.scss']
})
export class TreatementTemplateComponent implements OnInit {
  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('surveyjs') surveyjs: any;
  public frmnewTemplate: FormGroup;
  newTemplate = false;

  isOrderSet = false;
  isDocumentation = true;

  showMedService = true;
  showLabService = true;
  showNursingCareService = true;
  showPhysicianOrderService = true;
  showProcedureService = true;
  isTemplate = true;

  json: any
  showDocument = false;

  selectedFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};


  scopeLevels: any[] = [];
  forms: any[] = [];


  constructor(private formBuilder: FormBuilder, private scopeLevelService: ScopeLevelService,
    private formTypeService: FormTypeService, private formService: FormsService, private locker: CoolLocalStorage,
    private sharedService: SharedService, private documentationTemplateService: DocumentationTemplateService
  ) {
    this.sharedService.submitForm$.subscribe(payload => {

      let isVisibilityValid = this.frmnewTemplate.controls.visibility.valid;
      let isFormValid = this.frmnewTemplate.controls.docFrmList.valid;
      let isNameValid = this.frmnewTemplate.controls.name.valid;
      if (isVisibilityValid && isFormValid && isNameValid) {
        let doc = {
          data: payload,
          isEditable: this.frmnewTemplate.controls.isEditable.value,
          name: this.frmnewTemplate.controls.name.value,
          visibility: this.frmnewTemplate.controls.visibility.value,
          form: this.frmnewTemplate.controls.docFrmList.value._id
        }
        this.documentationTemplateService.create(doc).then(payload =>{
          console.log(payload);
          this.frmnewTemplate.reset();
        }).catch(err =>{
          console.log(err);
        })
      } else {
        console.log('invalid')
        this.frmnewTemplate.controls.visibility.markAsTouched();
        this.frmnewTemplate.controls.visibility.markAsDirty();
        this.frmnewTemplate.controls.visibility.markAsPristine();
        this.frmnewTemplate.controls.docFrmList.markAsTouched();
        this.frmnewTemplate.controls.name.markAsTouched();
      }
    });
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frmnewTemplate = this.formBuilder.group({
      name: ['', [Validators.required]],
      diagnosis: [''],
      visibility: [''],
      isEditable: [''],
      type: ['Documentation', [<any>Validators.required]],
      docFrmList: [''],
      chkLab: [''],
      chkMed: [''],
      chkDiagnostic: [''],
      chkProcedure: [''],
      chkImmunization: [''],
      chkNursing: [''],
      chkPhysician: [''],
    });

    this._getScopeLevels();
    this._getForms();

    this.frmnewTemplate.controls['type'].valueChanges.subscribe(value => {
      if (value === 'Documentation') {
        this.isDocumentation = true;
        this.isOrderSet = false;
      } else {
        this.isOrderSet = true;
        this.isDocumentation = false;
      }
    });

    this.frmnewTemplate.controls['docFrmList'].valueChanges.subscribe(value => {
      this._setSelectedForm(value);
    });
  }

  newTemplate_show() {
    this.newTemplate = !this.newTemplate;
  }

  _getScopeLevels() {
    this.scopeLevelService.find({}).then(payload => {
      this.scopeLevels = payload.data;
    }).catch(err => {

    })
  }

  _getForms() {
    try {
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
          console.log(error)
          this._getForms();
        })
    } catch (error) {
      this._getForms();
    }
  }

  _setSelectedForm(form) {
    this.selectedForm = form;
    this.showDocument = false;
    this.json = form.body;
    this.sharedService.announceNewForm({ json: this.json, form: this.selectedForm });
    this.showDocument = true;
    if (this.surveyjs !== undefined) {
      this.surveyjs.ngOnInit();
    }
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  public upload(e) {
    // console.log('am here')

    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append("excelfile", fileBrowser.files[0]);
    }
  }
  show_beneficiaries() {

  }
}
