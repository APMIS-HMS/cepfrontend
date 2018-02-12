import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility, Inventory, InventoryTransaction } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { StoreService, ProductService, InventoryService, InventoryInitialiserService, VitalService } from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  isEnable = false;
  saveAlert: true;
  products: any;
  selectedProduct: any = <any>{};
  myForm: FormGroup;
  batchForm: FormGroup;
  ischeck: boolean;
  name: any;
  isProcessing = false;
  isItemselected = true;
  checkingObject: any = <any>{};
  inventoryModel: Inventory = <Inventory>{};
  InventoryTxnModel: InventoryTransaction = <InventoryTransaction>{};
  //initializePriduct: InitProduct[];
  errorMessage = 'an error occured';
  addinside = false;
  productname: any;
  searchProduct: any;
  searchControl = new FormControl();
  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _inventoryEventEmitter: InventoryEmitterService,
    private _productService: ProductService,
    private _inventoryInitialiserService: InventoryInitialiserService,
    private _vitalService: VitalService,
    private systemModuleService: SystemModuleService, ) {
  }

  ngOnInit() {
    this.checkingObject = this._locker.getObject('checkingObject');
    this._inventoryEventEmitter.setRouteUrl('Initialize Store');
    this.myForm = this._fb.group({
      initproduct: this._fb.array([
      ])
    });
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((por: any) => {
        this._productService.find({ query: { facilityId: this.selectedFacility._id, name: { $regex: por, '$options': 'i' } } }).then(payload => {
          this.products = payload.data;
        }, err => {
          console.log(err);
        });
      })
    this.getProducts();
  }


  addBatch(i: number): void {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.push(this.createbatch());
  }

  createbatch(): FormGroup {
    return this._fb.group({
      batchNumber: ['', Validators.required],
      quantity: ['', Validators.required],
      productionDate: [new Date()],
      expiryDate: [new Date()]
    });
  }

  addProduct(product: any) {
    this.isEnable = true;
    this.isItemselected = false;
    this.myForm = this._fb.group({
      initproduct: this._fb.array([
      ])
    });
    this.selectedProduct = product;
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.push(
      this._fb.group({
        batchNumber: ['', Validators.required],
        quantity: ['', Validators.required],
        productionDate: [new Date()],
        expiryDate: [new Date()]
      })
    );
  }

  removeBatch(i: number) {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.removeAt(i);
  }

  getProducts() {
    this._productService.find({}).then(payload => {
      this.products = payload.data;
    });
    // this._productService.find({ query: { facilityId: this.selectedFacility._id, isInventory: false } }).then(payload => {
    //   this.products = payload.data;
    // });
  }


  save(valid, value, product) {
    if (valid) {
      var batches = {
        "batchItems": [],
        "product": {},
        "storeId": 0
      }
      console.log(value);
      value.initproduct.forEach(element => {
        element.availableQuantity = element.quantity;
      });
      batches.batchItems = value.initproduct;
      batches.product = product;
      batches.storeId = this.checkingObject.typeObject.storeId;
      this.isProcessing = true;
      console.log(batches);
      this._inventoryInitialiserService.create(batches).then(result => {
        console.log(result);
        if (result != null) {
          if (result.inventory != undefined) {
            this.getProducts();
            this.myForm = this._fb.group({
              initproduct: this._fb.array([
              ])
            });
            this.isEnable = false;
            this.isProcessing = false;
            this.systemModuleService.announceSweetProxy('Your product has been initialised successfully', 'success', this);
          } else {
            let text = "This product exist in your inventory";
            this.systemModuleService.announceSweetProxy(text, 'info', this);
            this.isEnable = false;
            this.isProcessing = false;
          }
        }
      }, error => {
        const errMsg = 'There was an error while initialising product, please try again!';
        this.systemModuleService.announceSweetProxy(errMsg, 'error');
        this.isEnable = false;
        this.isProcessing = false;
      });
    }
  }

}
