import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, FacilityService, ServiceCategory, ServiceItem } from '../../../../../models/index';
import { FacilitiesServiceCategoryService, ServiceDictionaryService } from '../../../../../services/facility-manager/setup/index';


@Component({
  selector: 'app-new-service',
  templateUrl: './new-service.component.html',
  styleUrls: ['./new-service.component.scss']
})
export class NewServiceComponent implements OnInit {
  facility: Facility = <Facility>{};
  categories: FacilityService[] = [];
  dictionaries: any[] = [];

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedService: any = <any>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';
  btnTitle = 'CREATE SERVICE';

  public frmNewservice: FormGroup;

  constructor(private formBuilder: FormBuilder, private _locker: CoolSessionStorage,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private serviceDictionaryService: ServiceDictionaryService) {

  }

  ngOnInit() {
    this.btnTitle = 'CREATE SERVICE';
    this.addNew();
    const subscribeForServiceDictionary = this.frmNewservice.controls['serviceName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.serviceDictionaryService.find({
        query:
        { word: { $regex: this.frmNewservice.controls['serviceName'].value, '$options': 'i' } }
      }).
        then(payload => {
          if (this.frmNewservice.controls['serviceName'].value.length === 0) {
            this.dictionaries = [];
          } else {
            this.dictionaries = payload.data;
          }

        })
      );

    subscribeForServiceDictionary.subscribe((payload: any) => {
    });



    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.getCategories();
    if (this.selectedService.categoryId !== undefined) {
      this.btnTitle = 'UPDATE SERVICE';
      this.frmNewservice.controls['serviceName'].setValue(this.selectedService.service);
      this.frmNewservice.controls['serviceCode'].setValue(this.selectedService.serviceCode);
      this.frmNewservice.controls['serviceCat'].setValue(this.selectedService.categoryId);
    }

  }

  getCategories() {
    this._facilitiesServiceCategoryService.find({ query: { facilityId: this.facility._id } }).then(payload => {
      if (payload.data.length > 0) {
        this.categories = payload.data[0].categories;
      }
    });
  }
  addNew() {
    this.frmNewservice = this.formBuilder.group({
      serviceName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      serviceCat: ['', [<any>Validators.required]],
      serviceAutoCode: ['', []],
      serviceCode: ['', []]
    });
  }
  onSelectDictionary(dic: any) {
    this.frmNewservice.controls['serviceName'].setValue(dic.word);
  }
  newService(model: any, valid: boolean) {
    if (valid) {
      this._facilitiesServiceCategoryService.find({
        query: {
          facilityId: this.facility._id
        }
      }).then(payload => {
        const serviceItem: ServiceItem = <ServiceItem>{};
        serviceItem.name = this.frmNewservice.controls['serviceName'].value;
        serviceItem.code = this.frmNewservice.controls['serviceCode'].value;
        let hasFound = false;
        let keepIndex = -1;
        let goingIndex = -1;
        payload.data[0].categories.forEach((item, i) => {

          if (this.btnTitle === 'CREATE SERVICE') {
            if (item._id === this.frmNewservice.controls['serviceCat'].value) {
              item.services.push(serviceItem);
            }
          } else {
            if (this.selectedService.categoryId === item._id) {
              keepIndex = i;
            }
            if (this.frmNewservice.controls['serviceCat'].value === item._id) {
              goingIndex = i;
            }
            if (item._id === this.frmNewservice.controls['serviceCat'].value && item._id === this.selectedService.categoryId) {
              {
                hasFound = true;
                item.services.forEach((itemk, k) => {
                  if (itemk._id === this.selectedService.serviceId) {
                    itemk.name = this.frmNewservice.controls['serviceName'].value;
                    itemk.code = this.frmNewservice.controls['serviceCode'].value;
                  }
                });
              }
            }
            if (goingIndex > -1 && keepIndex > -1) {
              payload.data[0].categories[keepIndex].services.forEach((itemk, k) => {
                if (itemk._id === this.selectedService.serviceId) {
                  itemk.name = this.frmNewservice.controls['serviceName'].value;
                  itemk.code = this.frmNewservice.controls['serviceCode'].value;
                  payload.data[0].categories[goingIndex].services.push(itemk);

                  payload.data[0].categories[keepIndex].services.forEach((itemm, m) => {
                    if (itemm._id === this.selectedService.serviceId) {
                      payload.data[0].categories[keepIndex].services.splice(m, 1);
                    }
                  });
                }
              });
            }
          }
        });
        this._facilitiesServiceCategoryService.update(payload.data[0]).then(callback => {
          this.frmNewservice.controls['serviceName'].setValue('');
          this.frmNewservice.controls['serviceCode'].setValue('');
        });
        if (this.dictionaries.length === 0) {
          this.serviceDictionaryService.create({ word: this.frmNewservice.controls['serviceName'].value }).then(inPayload => {
          });
        }
      });


    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
