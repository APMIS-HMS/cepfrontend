import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  FacilitiesService, InvestigationSpecimenService, InvestigationService, FacilitiesServiceCategoryService, ServicePriceService
} from '../../../../services/facility-manager/setup/index';
import { Facility, MinorLocation, FacilityService, FacilityServicePrice, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-investigation-service',
  templateUrl: './investigation-service.component.html',
  styleUrls: ['./investigation-service.component.scss']
})
export class InvestigationServiceComponent implements OnInit {
  user: User = <User>{};
  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = '';
  btnText = 'Create Investigation';
  panelBtnText = 'Create Panel';

  investigation_view = false;
  pannel_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  isNumeric = false;
  selectedFacility: Facility = <Facility>{};
  selectedInvestigation: any = <any>{};
  selectedFacilityService: FacilityService = <FacilityService>{};
  selectedServiceCategory: any = <any>{};

  reportTypes: any[] = ['Numeric', 'Text'];
  specimens: any[] = [];
  investigations: any[] = [];
  bindInvestigations: any[] = [];
  movedInvestigations: any[] = [];
  categories: any[] = [];
  loading: Boolean = true;

  public frmNewInvestigationh: FormGroup;
  public frmNewPanel: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private specimenService: InvestigationSpecimenService,
    private locker: CoolLocalStorage, private investigationService: InvestigationService,
    private dragulaService: DragulaService, private _facilityService: FacilitiesService,
    private facilityServiceCategoryService: FacilitiesServiceCategoryService, private servicePriceService: ServicePriceService) {
    dragulaService.drag.subscribe((value) => {
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value) => {
      this.onDrop(value.slice(1));
    });
  }
  private onDrag(args) {
    const [e, el] = args;
    // do something
  }

  private onDrop(args) {
    const [e, el] = args;
    // do something
  }

  private onOver(args) {
    const [e, el, container] = args;
    // do something
  }

  private onOut(args) {
    const [e, el, container] = args;
    // do something
  }
  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('miniFacility');
    this.user = <User> this.locker.getObject('auth');

    this.frmNewInvestigationh = this.formBuilder.group({
      investigationName: ['', [Validators.required]],
      ref: ['', [Validators.required]],
      maxRef: ['', []],
      reportType: ['Text', [Validators.required]],
      unit: ['', [Validators.required]],
      specimen: ['', [Validators.required]],
      isPanel: [false, [Validators.required]]
    });

    this.frmNewInvestigationh.controls['reportType'].valueChanges.subscribe(value => {
      if (value === 'Numeric') {
        this.isNumeric = true;
      } else {
        this.isNumeric = false;
      }
    })

    this.frmNewPanel = this.formBuilder.group({
      panelName: ['', [Validators.required]],
      isPanel: [true, [Validators.required]]
    });
    this.getSpecimens();
    this.getInvestigations();
    this.getServiceCategories();
  }

  getInvestigations() {
    this.investigationService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then(payload => {
      this.loading = false;
      this.investigations = payload.data;
      this.bindInvestigations = JSON.parse(JSON.stringify(payload.data));
    }).catch(err => this._notification('Error', 'There was a problem getting investigations. Please try again later!'));
  }
  getServiceCategories() {
    this.facilityServiceCategoryService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
     if (payload.data.length > 0) {
        this.selectedFacilityService = payload.data[0];
        this.categories = payload.data[0].categories;
        const index = this.categories.findIndex(x => x.name === 'Laboratory');
        this.selectedServiceCategory = this.categories[index];
      }
    });
  }
  
  editInvestigation(investigation) {
    if (!investigation.isPanel) {
      this.selectedInvestigation = investigation;
      this.frmNewInvestigationh.controls['investigationName'].setValue(this.selectedInvestigation.name);
      this.frmNewInvestigationh.controls['specimen'].setValue(this.selectedInvestigation.specimen);
      this.frmNewInvestigationh.controls['isPanel'].setValue(this.selectedInvestigation.isPanel);
      this.frmNewInvestigationh.controls['unit'].setValue(this.selectedInvestigation.unit);
      if (this.selectedInvestigation.reportType !== undefined) {
        if (this.selectedInvestigation.reportType.name === 'Text') {
          this.frmNewInvestigationh.controls['reportType'].setValue(this.selectedInvestigation.reportType.name);
          this.frmNewInvestigationh.controls['ref'].setValue(this.selectedInvestigation.reportType.ref);
        } else if (this.selectedInvestigation.reportType.name === 'Numeric') {
          this.frmNewInvestigationh.controls['reportType'].setValue(this.selectedInvestigation.reportType.name);
          this.frmNewInvestigationh.controls['ref'].setValue(this.selectedInvestigation.reportType.ref.min);
          this.frmNewInvestigationh.controls['maxRef'].setValue(this.selectedInvestigation.reportType.ref.max);
        }
      }

      this.btnText = 'Update Investigation';
      this.investigation_view = true;
      this.pannel_view = false;
    } else {
      this.selectedInvestigation = investigation;
      this.movedInvestigations = investigation.panel;
      const filteredArray = [];
      this.bindInvestigations.forEach((inv => {
        const filter = this.movedInvestigations.filter(x => x._id === inv._id).length > 0
        if (!filter && inv._id !== investigation._id) {
          filteredArray.push(inv);
        }
      }))
      this.bindInvestigations = filteredArray;
      this.frmNewPanel.controls['panelName'].setValue(investigation.name);
      this.panelBtnText = 'Update Panel';
      this.investigation_view = false;
      this.pannel_view = true;
    }
  }
  getSpecimens() {
    this.specimenService.findAll().then(payload => {
      this.specimens = payload.data;
    });
  }

  apmisLookupHandleSelectedItem(value) {

  }
  investigation_show() {
    this.investigation_view = !this.investigation_view;
    this.pannel_view = false;
  }
  pannel_show() {
    this.pannel_view = !this.pannel_view;
    this.investigation_view = false;
  }

  specimenDisplayFn(specimen: any) {
    return specimen ? specimen.name : specimen;
  }
  getRefrenceValues(reportType) {
    if (reportType !== undefined && reportType.name === 'Numeric') {
      return reportType.ref.min + ' - ' + reportType.ref.max;
    } else if (reportType !== undefined && reportType.name !== 'Numeric') {
      return reportType.ref;
    } else {
      return '';
    }
  }

  createInvestigation(valid, value) {
    if (valid) {
      if (this.selectedInvestigation._id === undefined) {
        const investigation: any = {
          facilityId: this.locker.getObject('miniFacility'),
          name: value.investigationName,
          unit: value.unit,
          specimen: value.specimen,
        }
        const reportType: any = {};
        if (value.reportType === 'Text') {
          reportType.name = value.reportType;
          reportType.ref = value.ref;
          investigation.reportType = reportType;
        } else if (value.reportType === 'Numeric') {
          reportType.name = value.reportType;
          reportType.ref = {
            max: value.maxRef,
            min: value.ref
          }
          investigation.reportType = reportType;
        }
        this.investigationService.create(investigation).then(payload => {
          const service: any = <any>{};
          service.name = value.investigationName;
          this.selectedFacilityService.categories.forEach((item, i) => {
            if (item.name === 'Laboratory') {
              item.services.push(service);
            }
          });
          this.facilityServiceCategoryService.update(this.selectedFacilityService).then((payResult: FacilityService) => {
            payResult.categories.forEach((itemi, i) => {
              if (itemi.name === 'Laboratory') {
                itemi.services.forEach((items, s) => {
                  if (items.name === service.name) {
                    payload.serviceId = items;
                    payload.facilityServiceId = this.selectedFacilityService._id;

                    const price: FacilityServicePrice = <FacilityServicePrice>{};
                    price.categoryId = itemi._id;
                    price.facilityId = this.selectedFacility._id;
                    price.serviceId = items._id;
                    price.facilityServiceId = this.selectedFacilityService._id;
                    price.price = 0;

                    const facilityService$ = Observable.fromPromise(this.servicePriceService.create(price));
                    const investigation$ = Observable.fromPromise(this.investigationService.update(payload));
                    Observable.forkJoin([facilityService$, investigation$]).subscribe(results => {
                      this.investigation_view = false;
                      this.frmNewInvestigationh.reset();
                      this.frmNewInvestigationh.controls['isPanel'].setValue(false);
                      this.investigations.push(payload);
                      // this.addToast('Investigation created successfully');
                      this._notification('Success', 'Investigation created successfully.');
                      this.getInvestigations();
                    });
                  }
                });
              }
            });
          });
        })
      } else {
        this.selectedInvestigation.name = this.frmNewInvestigationh.controls['investigationName'].value;
        this.selectedInvestigation.specimen = this.frmNewInvestigationh.controls['specimen'].value;
        this.selectedInvestigation.isPanel = this.frmNewInvestigationh.controls['isPanel'].value;
        this.selectedInvestigation.unit = this.frmNewInvestigationh.controls['unit'].value;
        const reportType: any = {};
        if (value.reportType === 'Text') {
          reportType.name = value.reportType;
          reportType.ref = value.ref;
          this.selectedInvestigation.reportType = reportType;
        } else if (value.reportType === 'Numeric') {
          reportType.name = value.reportType;
          reportType.ref = {
            max: value.maxRef,
            min: value.ref
          }
          this.selectedInvestigation.reportType = reportType;
        }
        this.investigationService.update(this.selectedInvestigation).then(payload => {
          if (this.selectedInvestigation.serviceId === undefined) {
            const service: any = <any>{};
            service.name = value.investigationName;
            this.selectedFacilityService.categories.forEach((item, i) => {
              if (item.name === 'Laboratory') {
                item.services.push(service);
              }
            });
            this.facilityServiceCategoryService.update(this.selectedFacilityService).then((payResult: FacilityService) => {
              payResult.categories.forEach((itemi, i) => {
                if (itemi.name === 'Laboratory') {
                  itemi.services.forEach((items, s) => {
                    if (items.name === service.name) {
                      payload.serviceId = items;
                      payload.facilityServiceId = this.selectedFacilityService._id;

                      const price: FacilityServicePrice = <FacilityServicePrice>{};
                      price.categoryId = itemi._id;
                      price.facilityId = this.selectedFacility._id;
                      price.serviceId = items._id;
                      price.facilityServiceId = this.selectedFacilityService._id;
                      price.price = 0;

                      const facilityService$ = Observable.fromPromise(this.servicePriceService.create(price));
                      const investigation$ = Observable.fromPromise(this.investigationService.update(payload));
                      Observable.forkJoin([facilityService$, investigation$]).subscribe(results => {
                        this.investigation_view = false;
                        this.btnText = 'Create Investigation';
                        this.selectedInvestigation = <any>{};
                        this.frmNewInvestigationh.reset();
                        this.frmNewInvestigationh.controls['isPanel'].setValue(false);
                        const index = this.investigations.findIndex((obj => obj._id === payload._id));
                        this.investigations.splice(index, 1, payload);
                        // this.addToast('Investigation updated successfully');
                        this._notification('Success', 'Investigation updated successfully.');
                        this.getInvestigations();
                      })
                    }
                  });
                }
              });
            });
          } else {
            this.investigation_view = false;
            this.btnText = 'Create Investigation';
            this.selectedInvestigation = <any>{};
            this.frmNewInvestigationh.reset();
            this.frmNewInvestigationh.controls['isPanel'].setValue(false);
            const index = this.investigations.findIndex((obj => obj._id === payload._id));
            this.investigations.splice(index, 1, payload);
            // this.addToast('Investigation updated successfully');
            this._notification('Success', 'Investigation updated successfully.');
            this.getInvestigations();
          }

        }, error => {
          this.btnText = 'Create Investigation';
          this.frmNewInvestigationh.reset();
          this.frmNewInvestigationh.controls['isPanel'].setValue(false);
        })
      }
    }
  }

  createPanel(valid, value) {
    if (valid) {
      if (this.selectedInvestigation._id === undefined) {
        const investigation: any = {
          facilityId: this.locker.getObject('miniFacility'),
          isPanel: true,
          name: value.panelName,
          panel: this.movedInvestigations
        }
        this.investigationService.create(investigation).then(payload => {





          //
          const service: any = <any>{};
          service.name = value.panelName;

          this.selectedFacilityService.categories.forEach((item, i) => {
            if (item.name === 'Laboratory') {
              item.services.push(service);
            }
          });
          this.facilityServiceCategoryService.update(this.selectedFacilityService).then((payResult: FacilityService) => {
            payResult.categories.forEach((itemi, i) => {
              if (itemi.name === 'Laboratory') {
                itemi.services.forEach((items, s) => {
                  if (items.name === service.name) {
                    payload.serviceId = items;
                    payload.facilityServiceId = this.selectedFacilityService._id;


                    const price: FacilityServicePrice = <FacilityServicePrice>{};
                    price.categoryId = itemi._id;
                    price.facilityId = this.selectedFacility._id;
                    price.serviceId = items._id;
                    price.facilityServiceId = this.selectedFacilityService._id;
                    price.price = 0;

                    const facilityService$ = Observable.fromPromise(this.servicePriceService.create(price));
                    const investigation$ = Observable.fromPromise(this.investigationService.update(payload));
                    Observable.forkJoin([facilityService$, investigation$]).subscribe(results => {
                      this.frmNewPanel.reset();
                      this.frmNewPanel.controls['isPanel'].setValue(true);
                      this.investigations.push(payload);
                    })
                  }
                });
              }
            });
          });

          //











        })
      } else {
        this.selectedInvestigation.name = this.frmNewPanel.controls['panelName'].value;
        this.selectedInvestigation.isPanel = this.frmNewPanel.controls['isPanel'].value;
        this.selectedInvestigation.panel = this.movedInvestigations;
        this.investigationService.update(this.selectedInvestigation).then(payload => {

          if (this.selectedInvestigation.serviceId === undefined) {


            //
            const service: any = <any>{};
            service.name = this.selectedInvestigation.name;
            this.selectedFacilityService.categories.forEach((item, i) => {
              if (item.name === 'Laboratory') {
                item.services.push(service);
              }
            });
            this.facilityServiceCategoryService.update(this.selectedFacilityService).then((payResult: FacilityService) => {
              payResult.categories.forEach((itemi, i) => {
                if (itemi.name === 'Laboratory') {
                  itemi.services.forEach((items, s) => {
                    if (items.name === service.name) {
                      payload.serviceId = items;
                      payload.facilityServiceId = this.selectedFacilityService._id;




                      const price: FacilityServicePrice = <FacilityServicePrice>{};
                      price.categoryId = itemi._id;
                      price.facilityId = this.selectedFacility._id;
                      price.serviceId = items._id;
                      price.facilityServiceId = this.selectedFacilityService._id;
                      price.price = 0;

                      const facilityService$ = Observable.fromPromise(this.servicePriceService.create(price));
                      const investigation$ = Observable.fromPromise(this.investigationService.update(payload));
                      Observable.forkJoin([facilityService$, investigation$]).subscribe(results => {
                        this.pannel_view = false;
                        this.btnText = 'Create Panel';
                        this.selectedInvestigation = <any>{};
                        this.frmNewPanel.reset();
                        this.frmNewPanel.controls['isPanel'].setValue(false);
                        const index = this.investigations.findIndex((obj => obj._id === payload._id));
                        this.investigations.splice(index, 1, payload);
                      })
                    }
                  });
                }
              });
            });

            //










          }
        }, error => {
          this.btnText = 'Create Panel';
          this.frmNewPanel.reset();
          this.frmNewPanel.controls['isPanel'].setValue(false);
        })


      }
    }
  }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
        users: [this.user._id],
        type: type,
        text: text
    });
  }

  close_onClick(message: boolean): void {
  }
}
