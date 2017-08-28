import { Component, OnInit, Input } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms"

@Component({
  selector: 'app-initialize-store',
  templateUrl: './initialize-store.component.html',
  styleUrls: ['./initialize-store.component.scss']
})
export class InitializeStoreComponent implements OnInit {

  myForm: FormGroup;
  constructor(private _fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this._fb.group({
      initproduct: this._fb.array([
        this.initProduct(),
      ])
    });
  }
  initProduct(){
    return this._fb.group({
      batchno: ['', Validators.required],
      quantity:['', Validators.required]
    });
  }
  addProduct(){
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.push(this.initProduct());
  }
  removeAddress(i: number){
    const control = <FormArray>this.myForm.controls['initproduct'];
    control.removeAt(i);
  }
   save(model) {
        // call API to save
        // ...
        console.log(model);
    }
}
