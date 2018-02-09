import { DocumentationTemplateService } from './../../../../services/facility-manager/setup/documentation-template.service';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ScopeLevelService, FormTypeService } from 'app/services/module-manager/setup';
import { OrderSetSharedService } from '../../../../services/facility-manager/order-set-shared-service';
import { Observable } from 'rxjs/Observable';
import { FormsService, FacilitiesService, OrderSetTemplateService } from 'app/services/facility-manager/setup';
import { OrderSetTemplate }  from '../../../../models/index';
import { Facility, User } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SharedService } from 'app/shared-module/shared.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

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
  json: any;
  showDocument = false;
  selectedFacility: Facility = <Facility>{};
  selectedForm: any = <any>{};
  scopeLevels: any[] = [];
  forms: any[] = [];
  orderSet: OrderSetTemplate = <OrderSetTemplate>{};
  saveTemplateText = true;
  savingTemplateText = false;
  editTemplateText = false;
  editingTemplateText = false;
  disableBtn = true;
  user: any = <any>{};

  constructor(
    private formBuilder: FormBuilder,
    private scopeLevelService: ScopeLevelService,
    private formTypeService: FormTypeService,
    private formService: FormsService,
    private _locker: CoolLocalStorage,
    private sharedService: SharedService,
    private _facilityService: FacilitiesService,
    private documentationTemplateService: DocumentationTemplateService,
    private _orderSetTemplateService: OrderSetTemplateService,
    private _orderSetSharedService: OrderSetSharedService,
    private _authFacadeService:AuthFacadeService,
    private _systemModuleService:SystemModuleService
  ) {
    this.sharedService.submitForm$.subscribe(payload => {
      console.log('in')
      this._systemModuleService.on();
      const isVisibilityValid = this.frmnewTemplate.controls.visibility.valid;
      const isFormValid = this.frmnewTemplate.controls.docFrmList.valid;
      const isNameValid = this.frmnewTemplate.controls.name.valid;
      if (isVisibilityValid && isFormValid && isNameValid) {
        const doc = {
          data: payload,
          isEditable: this.frmnewTemplate.controls.isEditable.value,
          name: this.frmnewTemplate.controls.name.value,
          visibility: this.frmnewTemplate.controls.visibility.value,
          form: this.frmnewTemplate.controls.docFrmList.value._id
        };
        this.documentationTemplateService
          .create(doc)
          .then(payload2 => {
            console.log('inin')
            this._systemModuleService.off();
            this._systemModuleService.announceSweetProxy('Template has been saved successfully!','success');
             this.isOrderSet = false;
            this.frmnewTemplate.reset();
            this.isOrderSet = false;
            this.frmnewTemplate.controls.type.setValue('Documentation');
          })
          .catch(err => {
            this._systemModuleService.off();
            this._systemModuleService.announceSweetProxy('There was an error while saving template','error');
          });
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
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');
    this.frmnewTemplate = this.formBuilder.group({
      name: ['', [Validators.required]],
      diagnosis: [''],
      visibility: [''],
      isEditable: [''],
      type: ['Documentation', [<any>Validators.required]],
      docFrmList: [''],
      category: ['medication'],
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
        if (!!this.orderSet.medications) {
            const findItem = this.orderSet.medications
            .filter(x => x.genericName === value.medications[0].genericName && x.strength === value.medications[0].strength);
            if (findItem.length === 0) {
              this.orderSet.medications.push(value.medications[0]);
            }
        } else {
          this.orderSet.medications = [];
          this.orderSet.medications.push(value.medications[0]);
        }
      } else if (!!value.investigations) {
        if (!!this.orderSet.investigations) {
          const findItem = this.orderSet.investigations.filter(x => x._id === value.investigations[0]._id);
          if (findItem.length === 0) {
            this.orderSet.investigations.push(value.investigations[0]);
          }
        } else {
          this.orderSet.investigations = [];
          this.orderSet.investigations.push(value.investigations[0]);
        }
      } else if (!!value.procedures) {
        if (!!this.orderSet.procedures) {
          if (this.orderSet.procedures.length > 0) {
            const findItem = this.orderSet.procedures.filter(x => x._id === value.procedures[0]._id);
            if (findItem.length === 0) {
              this.orderSet.procedures.push(value.procedures[0]);
            }
          } else {
            this.orderSet.procedures.push(value.procedures[0]);
          }
        } else {
          // this.orderSet.procedures = [];
          this.orderSet.procedures = value.procedures;
        }
      } else if (!!value.nursingCares) {
        if (!!this.orderSet.nursingCares) {
          const findItem = this.orderSet.nursingCares.filter(x => x.name === value.nursingCares[0].name);
          if (findItem.length === 0) {
            this.orderSet.nursingCares.push(value.nursingCares[0]);
          }
        } else {
          this.orderSet.nursingCares = [];
          this.orderSet.nursingCares.push(value.nursingCares[0]);
        }
      } else if (!!value.physicianOrders) {
        if (!!this.orderSet.physicianOrders) {
          const findItem = this.orderSet.physicianOrders.filter(x => x.name === value.physicianOrders[0].name);
          if (findItem.length === 0) {
            this.orderSet.physicianOrders.push(value.physicianOrders[0]);
          }
        } else {
          this.orderSet.physicianOrders = [];
          this.orderSet.physicianOrders.push(value.physicianOrders[0]);
        }
      }

      console.log(this.orderSet);
    });
  }

  save(valid: boolean, value: any) {
    // validate form
    this._systemModuleService.on();
    const validateForm = this.validateForm(value, 'Order Set');
    if (validateForm) {
      const orderSet = JSON.stringify(this.orderSet);
      const payload = {
        name: value.name,
        facilityId: this.selectedFacility._id,
        createdById: this.user.data._id,
        diagnosis: value.diagnosis,
        visibility: value.visibility,
        type: value.type,
        editedByOthers:  value.isEditable ? true : false,
        body: orderSet,
      };

      // Save to database
      this._orderSetTemplateService.create(payload).then(res => {
        this._systemModuleService.off();
        if (res._id) {
          this.orderSet = <OrderSetTemplate>{};
          this.onClickRadioBtn('medication');
          this.frmnewTemplate.controls['diagnosis'].setValue('');
          this.frmnewTemplate.controls['visibility'].setValue('');
          this.frmnewTemplate.controls['name'].setValue('');
          this.frmnewTemplate.controls['category'].setValue('medication');
          this._systemModuleService.announceSweetProxy('Template has been saved successfully!','success');
        }
      }).catch(err => {
        this._systemModuleService.off();
        console.log(err);
      });
    } else {
      this._systemModuleService.announceSweetProxy('Some fields are required! Please fill all required fields.','error');
    }
  }

  deleteOrderSetItem(index: number, value: any, type: string) {
    if (type === 'medication') {
      const findItem = this.orderSet.medications.filter(x => x.genericName === value.genericName && x.strength === value.strength);

      if (findItem.length > 0) {
        this.orderSet.medications.splice(index, 1);
      }
    } else if (type === 'investigation') {
      const findItem = this.orderSet.investigations.filter( x => x._id === value._id );

      if (findItem.length > 0) {
        this.orderSet.investigations.splice(index, 1);
      }
    } else if (type === 'procedure') {
      const findItem = this.orderSet.procedures.filter(x => x._id === value._id);

      if (findItem.length > 0) {
        this.orderSet.procedures.splice(index, 1);
      }
    } else if (type === 'nursingCare') {
      const findItem = this.orderSet.nursingCares.filter(x => x.name === value.name);

      if (findItem.length > 0) {
        this.orderSet.nursingCares.splice(index, 1);
      }
    } else if (type === 'physicianOrder') {
      const findItem = this.orderSet.physicianOrders.filter(x => x.name === value.name);

      if (findItem.length > 0) {
        this.orderSet.physicianOrders.splice(index, 1);
      }
    }
    console.log(this.orderSet);
  }

  getCondition() {
    if ((this.orderSet.medications === undefined || this.orderSet.medications.length === 0)
    && (this.orderSet.procedures === undefined || this.orderSet.procedures.length === 0)
    && (this.orderSet.investigations === undefined || this.orderSet.investigations.length === 0)
    && (this.orderSet.physicianOrders === undefined || this.orderSet.physicianOrders.length === 0)
    && (this.orderSet.nursingCares === undefined || this.orderSet.nursingCares.length === 0)) {
      return true;
    } else { return false; }
  }

  validateForm(form, type) {
    const o = this.orderSet;
    const inves = o.investigations === undefined;
    const med = o.medications === undefined;
    const nur = o.nursingCares === undefined;
    const phy = o.physicianOrders === undefined;
    const pro = o.procedures === undefined;
    if (type === 'Order Set') {
      if ((form.diagnosis === ''|| form.name === '' || form.type === '' || form.visibility === '') || (inves && med && nur && phy && pro)) {
          return false;
      } else {
        return true;
      }
    }else{
      return true;
    }
  }

  newTemplate_show() {
    this.newTemplate = !this.newTemplate;
  }

  _getScopeLevels() {
    this.scopeLevelService.find({}).then(payload => {
      this.scopeLevels = payload.data;
    }).catch(err => {});
  }

  _getForms() {
    try {
      const formType$ = Observable.fromPromise(
        this.formTypeService.find({ query: { name: 'Documentation' } })
      );
      formType$.mergeMap((formTypes: any) =>
          Observable.fromPromise(
            this.formService.find({
              query: {
                $limit: 200,
                facilityId: this.selectedFacility._id,
                typeOfDocumentId: formTypes.data[0]._id,
                isSide: false
              }
            })
          )
        ).subscribe((results: any) => {
            this.forms = results.data;
          },error => {
            this._getForms();
          }
        );
    } catch (error) {
      this._getForms();
    }
  }

  _setSelectedForm(form) {
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
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click();
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

  show_beneficiaries() {}

  // Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}
}
