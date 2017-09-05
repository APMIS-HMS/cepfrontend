import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility,Inventory,InventoryTransaction} from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ProductService,InventoryService } from '../../../../services/facility-manager/setup/index';

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
  inventoryModel:Inventory=<Inventory>{};
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
      quantity: ['', Validators.required]
    });
  }
  addProduct(index: number, ischecked: boolean, data: any){
    if (ischecked) {
      this.selectedProducts.push(data);
      const control = <FormArray>this.myForm.controls['initproduct'];
      control.push(this.initProduct());
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
    console.log(value);
     if(valid){
       console.log(value);
      this.inventoryModel.facilityId = this.selectedFacility._id;
      this.inventoryModel.storeId;
      this.inventoryModel.serviceId;
      this.inventoryModel.categoryId;
      this.inventoryModel.facilityServiceId;
      this.inventoryModel.productId = this.selectedProducts._id;
      this.inventoryModel.totalQuantity = value.totalQuantity;
      this.inventoryModel.transactions = [];
      this.InventoryTxnModel.batchNumber = value.batchNumber;
      this.InventoryTxnModel.quantity = value.quantity;
      this.inventoryModel.transactions.push(this.InventoryTxnModel)
      this._inventoryService.create(this.inventoryModel).then(payload => {
        console.log(payload);
      });
     }
    }
}
