import { DocumentationTemplateService } from './../../../../services/facility-manager/setup/documentation-template.service';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ScopeLevelService, FormTypeService } from 'app/services/module-manager/setup';
import { OrderSetSharedService } from '../../../../services/facility-manager/order-set-shared-service';
import { Observable } from 'rxjs/Observable';
import { FormsService } from 'app/services/facility-manager/setup';
import { OrderSetTemplate }  from '../../../../models/index';
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
  showLabService = false;
  showNursingCareService = false;
  showPhysicianOrderService = false;
  showProcedureService = false;
  isTemplate = true;
  json: any
  showDocument = false;
  selectedFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};
  scopeLevels: any[] = [];
  forms: any[] = [];
  orderSet: OrderSetTemplate = <OrderSetTemplate>{};

  constructor(private formBuilder: FormBuilder, private scopeLevelService: ScopeLevelService,
    private formTypeService: FormTypeService, private formService: FormsService, private locker: CoolLocalStorage,
    private sharedService: SharedService, private documentationTemplateService: DocumentationTemplateService,
    private _orderSetSharedService: OrderSetSharedService
  ) {
    this.sharedService.submitForm$.subscribe(payload => {

      let isVisibilityValid = this.frmnewTemplate.controls.visibility.valid;
      let isFormValid = this.frmnewTemplate.controls.docFrmList.valid;
      let isNameValid = this.frmnewTemplate.controls.name.valid;
      if (isVisibilityValid && isFormValid && isNameValid) {
        const doc = {
          data: payload,
          isEditable: this.frmnewTemplate.controls.isEditable.value,
          name: this.frmnewTemplate.controls.name.value,
          visibility: this.frmnewTemplate.controls.visibility.value,
          form: this.frmnewTemplate.controls.docFrmList.value._id
        }
        this.documentationTemplateService.create(doc).then(payload =>{
          this.frmnewTemplate.reset();
        }).catch(err =>{
        })
      } else {
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

    // Listen to the event from children components
    this._orderSetSharedService.itemSubject.subscribe(value => {
      console.log(value);
      if (!!value.medications) {
        this.orderSet.medications = value.medications;
      } else if (!!value.laboratories) {
        this.orderSet.laboratories = value.laboratories;
      } else if (!!value.procedures) {
        this.orderSet.procedures = value.procedures;
      } else if (!!value.nursingCares) {
        this.orderSet.nursingCares = value.nursingCares;
      } else if (!!value.physicianOrders) {
        this.orderSet.physicianOrders = value.physicianOrders
      }

      console.log(this.orderSet);
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

  onClickRadioBtn(value: string) {
    console.log(value);
    if (value === 'medication') {
      this.showMedService = true;
      this.showLabService = false;
      this.showNursingCareService = false;
      this.showPhysicianOrderService = false;
      this.showProcedureService = false;
    } else if (value === 'laboratory') {
      this.showMedService = false;
      this.showLabService = true;
      this.showNursingCareService = false;
      this.showPhysicianOrderService = false;
      this.showProcedureService = false;
    } else if (value === 'nursingCare') {
      this.showMedService = false;
      this.showLabService = false;
      this.showNursingCareService = true;
      this.showPhysicianOrderService = false;
      this.showProcedureService = false;
    } else if (value === 'procedure') {
      this.showMedService = false;
      this.showLabService = false;
      this.showNursingCareService = false;
      this.showPhysicianOrderService = false;
      this.showProcedureService = true;
    } else if (value === 'physicianOrder') {
      this.showMedService = false;
      this.showLabService = false;
      this.showNursingCareService = false;
      this.showPhysicianOrderService = true;
      this.showProcedureService = false;
    }
  }

  public upload(e) {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('excelfile', fileBrowser.files[0]);
    }
  }

  show_beneficiaries() {

  }
}
