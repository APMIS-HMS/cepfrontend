import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { Facility, MinorLocation, StoreModel } from '../../../../models/index';
import { ProductTypeService, StoreService } from '../../../../services/facility-manager/setup/index';


@Component({
  selector: 'app-new-store',
  templateUrl: './new-store.component.html',
  styleUrls: ['./new-store.component.scss']
})
export class NewStoreComponent implements OnInit {

  selectedFacility: Facility = <Facility>{};
  selectedMinorLocation: MinorLocation = <MinorLocation>{};

  minorLocations: MinorLocation[] = [];
  productTypes: any[] = [];
  stores: any[] = [];

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frm_newStore: FormGroup;
  createText = 'Create Store';
  loadIndicatorVisible = false;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedStore: any = <any>{};
  constructor(private formBuilder: FormBuilder, private locker: CoolSessionStorage, private productTypeService: ProductTypeService,
    private storeService: StoreService) { }

  ngOnInit() {
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.frm_newStore = this.formBuilder.group({
      name: ['', [<any>Validators.required]],
      minorLocationId: ['', [<any>Validators.required]],
      description: ['', [<any>Validators.required]],
      canDespense: [false, [<any>Validators.required]],
      canReceivePurchaseOrder: [false, [<any>Validators.required]],
      facilityId: [this.selectedFacility._id, [<any>Validators.required]],
    });
    this.minorLocations = this.selectedFacility.minorLocations;
    this.getProductTypes();
    this.populateStore();
  }

  getProductTypes() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      payload.data.forEach((item, i) => {
        let newItem: StoreModel = <StoreModel>{};
        newItem._id = item._id;
        newItem.name = item.name;
        newItem.facilityId = item.facilityId;
        newItem.isChecked = false;
        this.productTypes.push(newItem);
      });
      if (this.selectedStore._id !== undefined) {
        this.productTypes.forEach((item, i) => {
          this.selectedStore.productTypeId.forEach((item2, j) => {
            if (item._id === item2.productTypeId) {
              item.isChecked = true;
            }
          });
        });
      }

    });
  }
  populateStore() {
    if (this.selectedStore._id !== undefined) {
      this.createText = 'Update';
      this.frm_newStore.controls['name'].setValue(this.selectedStore.name);
      this.frm_newStore.controls['minorLocationId'].setValue(this.selectedStore.minorLocationId);
      this.frm_newStore.controls['description'].setValue(this.selectedStore.description);
      this.frm_newStore.controls['canDespense'].setValue(this.selectedStore.canDespense);
      this.frm_newStore.controls['canReceivePurchaseOrder'].setValue(this.selectedStore.canReceivePurchaseOrder);
    } else {
      this.createText = 'Create';
      this.frm_newStore.reset();
      this.frm_newStore.controls['facilityId'].setValue(this.selectedFacility._id);
    }
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  onValueChanged(e, productType) {
    productType.isChecked = e.value;
  }
  create(valid, value) {
    if (valid) {
      this.mainErr = true;
      if (this.selectedStore._id === undefined) {
        value.facilityId = this.selectedFacility._id;
        value.productTypeId = [];
        this.productTypes.forEach((item, i) => {
          if (item.isChecked === true) {
            value.productTypeId.push({ productTypeId: item._id });
          }
        });
        this.storeService.create(value).then(payload => {
          this.frm_newStore.reset();
          this.productTypes.forEach((item, i) => {
            item.isChecked = false;
          });
          this.closeModal.emit(true);
        }, error => {
          console.log(error);
        });
      } else {
        this.selectedStore.name = value.name;
        this.selectedStore.minorLocationId = value.minorLocationId;
        this.selectedStore.description = value.description;
        this.selectedStore.canDespense = value.canDespense;
        this.selectedStore.canReceivePurchaseOrder = value.canReceivePurchaseOrder;
        this.selectedStore.productTypeId = [];
        this.productTypes.forEach((item, i) => {
          if (item.isChecked === true) {
            this.selectedStore.productTypeId.push({ productTypeId: item._id });
          }
        });
        this.storeService.update(this.selectedStore).then(payload => {
          this.close_onClick();
        });
      }

    } else {
      this.mainErr = false;
    }
  }
}
