import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility, Inventory, InventoryTransaction } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService, ProductService, InventoryService, InventoryInitialiserService, VitalService } from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  saveAlert: true;
  products: any;
  selectedProduct: any = <any>{};
  myForm: FormGroup;
  batchForm: FormGroup;
  ischeck: boolean;
  name: any;
  isProcessing=false;
  isItemselected = true;
  checkingObject: any = <any>{};
  inventoryModel: Inventory = <Inventory>{};
  InventoryTxnModel: InventoryTransaction = <InventoryTransaction>{};
  //initializePriduct: InitProduct[];
  errorMessage = 'an error occured';
  addinside = false;
  productname:any;
  searchProduct:any;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _inventoryEventEmitter: InventoryEmitterService,
    private _productService: ProductService,

    private _inventoryInitialiserService: InventoryInitialiserService,
    private _vitalService: VitalService) {
  }

  ngOnInit() {
    this.checkingObject = this._locker.getObject('checkingObject');
    this._inventoryEventEmitter.setRouteUrl('Initialize Store');
    this.myForm = this._fb.group({
      initproduct: this._fb.array([
      ])
    });
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getProducts();
  }


  addBatch(i: number): void {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.push(this.createbatch());
  }

  createbatch(): FormGroup {
    return this._fb.group({
      batchNumber: ['', Validators.required],
      quantity: ['', Validators.required]
    });
  }

  addProduct(product: any) {
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
        quantity: ['', Validators.required]
      })
    );
  }

  removeBatch(i: number) {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.removeAt(i);
  }

  getProducts() {
    this._productService.find({ query: { facilityId: this.selectedFacility._id, isInventory: false } }).then(payload => {
      this.products = payload.data;
    });
  }


  save(valid, value, product) {
    if (valid) {
      var batches = {
        "batchItems": [],
        "product": {},
        "storeId": 0
      };

      batches.batchItems = value.initproduct;
      batches.product = product;
      batches.storeId = this.checkingObject.typeObject.storeId;
      this.isProcessing = true;
      this._inventoryInitialiserService.post(batches, {}).then(result => {
        if (result.body == true) {
          this.getProducts();
          this.myForm = this._fb.group({
            initproduct: this._fb.array([
            ])
          });
          this.isProcessing = false;
        }
      }, error => {
      });
    }
  }

}
