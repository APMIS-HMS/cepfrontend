import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility,Inventory,InventoryTransaction} from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import {StoreService, ProductService,InventoryService} from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  products: any;
  selectedProducts: any = <any>[];
  myForm: FormGroup;
  ischeck: boolean;
  name: any;
  checkingObject: any = <any>{};
  inventoryModel:Inventory = <Inventory>{};
  InventoryTxnModel:InventoryTransaction=<InventoryTransaction>{};
  //initializePriduct: InitProduct[];
  errorMessage = 'an error occured';

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolSessionStorage,
    private _inventoryEventEmitter: InventoryEmitterService,
    private _productService: ProductService,
    private _inventoryService: InventoryService) {
   }

  ngOnInit() {
    this.checkingObject = this._locker.getObject('checkingObject');
    this._inventoryEventEmitter.setRouteUrl('Initialize Store');
    this.myForm = this._fb.group({
      initproduct: this._fb.array([

      ])
    });
    this.selectedFacility = <Facility> this._locker.getObject('selectedFacility');
    this.getProducts();
  }
  initProduct() {
    return this._fb.group({
      batchno: ['', Validators.required],
      quantity: ['', Validators.required],
      product: ['']
    });
  }
  addProduct(index: number, ischecked: boolean, data: any){
    if (ischecked) {
      this.selectedProducts.push(data);
      const control = <FormArray>this.myForm.controls['initproduct'];
      control.push(
        this._fb.group({
          batchno: ['', Validators.required],
          quantity: ['', Validators.required],
          product: [data, Validators.required]
        })
      );
      //control.push(this.initProduct());
      console.log(this.selectedProducts);
    } else {
      this.removeProduct(index);
      this.selectedProducts.splice(index, 1);
    }   
  }
  removeProduct(i: number){
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.removeAt(i);
  }
  getProducts() {
    this._productService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.products = payload.data;
      console.log(this.products);
    });
  }
//   searchProduct(){
//     this._productService.find({ query: { name: this.products.name} }).then(payload => {
//       this.name = payload.data;
//       console.log(this.name);
//     });
// }
   save(valid,value) {
     if(valid){
       console.log(value);
      const transactionsArray = [];
      let totalQuantity = 0;
      value.initproduct.forEach(item => {
          console.log(item);
          let batchObject = {
            batchNumber: item.batchno,
            quantity: item.quantity,
          }
          totalQuantity += item.quantity;
          transactionsArray.push(batchObject);
          this.inventoryModel = <Inventory> {
            facilityId: this.selectedFacility._id,
            storeId: this.checkingObject.typeObject.storeId,
            serviceId: item.product.serviceId,
            categoryId: item.product.categoryId,
            facilityServiceId: item.product.facilityServiceId,
            productId: item.product._id,
            transactions: transactionsArray,
            reorderLevel: 0,
            reorderQty: 0,
            isOpen: false,
          };
      });
       console.log(this.inventoryModel);
       this.inventoryModel.totalQuantity = totalQuantity;
       this._inventoryService.create(this.inventoryModel).then(payload => {
         console.log(payload);
        this.myForm.reset();

        });
     }
    }
    
}
