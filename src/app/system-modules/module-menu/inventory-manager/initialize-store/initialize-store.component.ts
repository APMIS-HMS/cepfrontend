
import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility, Inventory, InventoryTransaction } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { ProductService, InventoryInitialiserService } from '../../../../services/facility-manager/setup/index';

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
  // initializePriduct: InitProduct[];
  errorMessage = 'an error occured';
  addinside = false;
  productname: any;
  searchProduct: any;
  searchControl = new FormControl();
  selectedPacks = [];

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _inventoryEventEmitter: InventoryEmitterService,
    private _productService: ProductService,
    private _inventoryInitialiserService: InventoryInitialiserService,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService) {
  }

  ngOnInit() {
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.checkingObject = payload.storeCheckIn.find(x => x.isOn === true);
    });
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
        this._productService.find({
          query: {
            facilityId: this.selectedFacility._id, name:
              { $regex: por, '$options': 'i' }
          }
        }).then(payload => {
          this.products = payload.data;
        }, err => {
        });
      })
    this.getProducts();
  }


  addBatch(i: number): void {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.push(this.createbatch());
  }

  createbatch(): FormGroup {
    if (this.selectedProduct.productConfigObject !== undefined) {
      return this._fb.group({
        batchNumber: ['', Validators.required],
        quantity: ['', Validators.required],
        config: this.initProductConfig(this.selectedProduct.productConfigObject),
        expiryDate: [new Date()]
      });
    } else {
      return this._fb.group({
        batchNumber: ['', Validators.required],
        quantity: ['', Validators.required],
        config: [],
        expiryDate: [new Date()]
      });
    }
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
    if (product.productConfigObject !== undefined) {
      let prodObj = this._fb.group({
        batchNumber: ['', Validators.required],
        quantity: ['', Validators.required],
        config: this.initProductConfig(product.productConfigObject),
        expiryDate: [new Date()]
      });

      control.push(
        prodObj
      );
    } else {
      control.push(
        this._fb.group({
          batchNumber: ['', Validators.required],
          quantity: ['', Validators.required],
          config: [],
          expiryDate: [new Date()]
        })
      );
    }
  }
  initProductConfig(config) {
    console.log(config);
    let frmArray = new FormArray([])
    config.forEach(item => {
      frmArray.push(new FormGroup({
        size: new FormControl(0),
        name: new FormControl(item.name),
        isBase: new FormControl(item.isBase),
        packVolume: new FormControl(item.size)
      }));
    })
    return frmArray;
  }
  getProductConfig(form) {
    return form.controls.config.controls;
  }
  removeBatch(i: number) {
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.removeAt(i);
  }

  getProducts() {
    this._productService.find({ query: { loginFacilityId: this.selectedFacility._id } }).then(payload => {
      this.products = payload.data;
    });
  }

  onPackageSize(i) {
    (<FormArray>this.myForm['controls'].initproduct['controls'][i]).value.quantity = 0;
    console.log(<FormArray>this.myForm['controls'].initproduct['controls'][i]);
    let itm = <FormArray>this.myForm['controls'].initproduct['controls'][i].value.config.forEach(element => {
      (<FormArray>this.myForm['controls'].initproduct['controls'][i]).value.quantity += element.size * element.packVolume;
    });
    (<FormArray>this.myForm.controls['initproduct']).setValue(JSON.parse(JSON.stringify((<FormArray>this.myForm.controls['initproduct']).value)));
  }


  save(valid, value, product) {
    if (valid) {
      const batches = {
        'batchItems': [],
        'product': {},
        'storeId': 0
      }
      value.initproduct.forEach(element => {
        element.availableQuantity = element.quantity;
      });
      batches.batchItems = value.initproduct;
      batches.product = product;
      batches.storeId = this.checkingObject.storeId;
      this.isProcessing = true;
      this._inventoryInitialiserService.create(batches).then(result => {
        if (result != null) {
          if (result.inventory !== undefined) {
            this.getProducts();
            this.myForm = this._fb.group({
              initproduct: this._fb.array([
              ])
            });
            this.isEnable = false;
            this.isProcessing = false;
            this.systemModuleService.announceSweetProxy('Your product has been initialised successfully', 'success', null, null, null, null, null, null, null);
          } else {
            const text = 'This product exist in your inventory';
            this.systemModuleService.announceSweetProxy(text, 'info');
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
