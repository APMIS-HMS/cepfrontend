import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Facility } from '../../../../models/index';
import { CoolSessionStorage } from 'angular2-cool-storage';
import { ProductService } from '../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  products: any = <any>[];
  selectedProducts: any = <any>[];
  myForm: FormGroup;
  ischeck: boolean;
  constructor(private _fb: FormBuilder,private _locker: CoolSessionStorage, private _productService: ProductService) {

   }

  ngOnInit() {
    this.myForm = this._fb.group({
      initproduct: this._fb.array([
        this.initProduct(),
      ])
    });
    this.selectedFacility = <Facility> this._locker.getObject('selectedFacility');
    this.getProducts();
  }
  initProduct(){
    return this._fb.group({
      batchno: ['', Validators.required],
      quantity:['', Validators.required]
    });
  }
  addProduct(index: number, ischecked: boolean, data: any){
    if(ischecked){
      this.selectedProducts.push(data);
      const control = <FormArray>this.myForm.controls['initproduct'];
      control.push(this.initProduct());
      console.log(this.selectedProducts);
    }
    else {
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
   save() {
        // call API to save
        console.log(this.myForm.value);
    }
}
