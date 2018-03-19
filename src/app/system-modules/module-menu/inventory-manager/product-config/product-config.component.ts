import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-config',
  templateUrl: './product-config.component.html',
  styleUrls: ['./product-config.component.scss']
})
export class ProductConfigComponent implements OnInit {

  packages = [];
  products = [];
  selectedFacility = {};
  selectedProduct = {};
  myForm: FormGroup;
  packageForm: FormGroup;
  searchProdductControl: FormControl = new FormControl();

  constructor(private _fb: FormBuilder,
    private productService: ProductService,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.myForm = this._fb.group({
      package: this._fb.array([
      ])
    });
    this.searchProdductControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value !== null && value.length === 0) {
          this.systemModuleService.on();
          this.productService
            .find({
              query: {
                name: { $regex: this.searchProdductControl.value, $options: 'i' }
              }
            })
            .then(payload => {
              this.systemModuleService.off();
              this.products = payload.data;
            })
            .catch(err => { });
        }
      });

  }

  getPackagesizes() {
    this.productService.findPackageSize({}).then(payload => {
      this.packages = payload.data;
    });
  }

  onSelectProduct(value){
  this.selectedProduct = value;
  }

  addPackage(i: number): void {
    const control = <FormArray>this.myForm.controls['package'];
    control.push(this.createPackage());
  }

  createPackage(): FormGroup {
    return this._fb.group({
      pack: ['', Validators.required],
      size: [0, Validators.required]
    });
  }
}
