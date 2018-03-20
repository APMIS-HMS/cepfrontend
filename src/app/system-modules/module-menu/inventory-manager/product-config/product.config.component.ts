import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-config',
  templateUrl: './product.config.component.html',
  styleUrls: ['./product.config.component.scss']
})
export class ProductConfigComponent implements OnInit {

  packages = [];
  products = [];
  selectedFacility: any = {};
  selectedProduct: any = {};
  packageForm: FormGroup;
  searchProdductControl: FormControl = new FormControl();
  btnSave = new FormControl();
  btnShowStatus = true;

  apmisLookupUrl = 'products';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisInvestigationLookupQuery: any = {
  };
  control;
  constructor(private _fb: FormBuilder,
    private productService: ProductService,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.packageForm = this._fb.group({
      'package': this._fb.array([
        this._fb.group({
          name: ['', Validators.required],
          size: [0, Validators.required],
          id: ['']
        })
      ])
    });
    this.packageForm.controls['package'] = this._fb.array([]);

    const control = <FormArray>this.packageForm.controls['package'];
    this.searchProdductControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        if (value.length >= 3) {
          this.apmisInvestigationLookupQuery = {
            name: { $regex: this.searchProdductControl.value, '$options': 'i' },
          }
        }
      });
    this.getPackagesizes();
  }

  getPackagesizes() {
    this.productService.findPackageSize({}).then(payload => {
      this.packages = payload.data;
    });
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this.selectedProduct = value;
  }

  onSelectProduct(value) {
    this.selectedProduct = value;
  }

  addPackage(event, item, i): void {
    console.log(item);
    console.log(event.target.checked);
    if (event.target.checked === true) {
      (<FormArray>this.packageForm.controls['package'])
        .push(
          this._fb.group({
            name: [item.name, [<any>Validators.required]],
            size: [0, [<any>Validators.required]],
            id: [item._id]
          })
        );
    } else {
      let indexToRemove = 0;
      (<FormArray>this.packageForm.controls['package']).controls.forEach((item: any, i) => {
        const packagelValue: any = (<any>item).controls['id'].value;
        if (packagelValue === item._id || packagelValue === item.id) {
          indexToRemove = i;
        }
      });
      const count = (<FormArray>this.packageForm.controls['package']).controls.length;
      if (count === 1) {
        this.packageForm.controls['package'] = this._fb.array([]);
      } else {
        (<FormArray>this.packageForm.controls['package']).controls.splice(indexToRemove, 1);
      }
    }
  }

  createPackage(item): FormGroup {
    return this._fb.group({
      name: [item.name, Validators.required],
      size: [0, Validators.required]
    });
  }

  save() {
    if ((<FormArray>this.packageForm.controls['package']).valid) {
      this.btnShowStatus = false;
      this.systemModuleService.on();
      let productConfig: any = {};
      productConfig.productId = this.selectedProduct._id;
      productConfig.facilityId = this.selectedFacility._id;
      productConfig.packSizes = (<FormArray>this.packageForm.controls['package']).value;
      // (<FormArray>this.packageForm.controls['package']).controls.forEach((itemi, i) => {
      //   console.log(itemi.value);
      //   productConfig.packSizes.push(itemi.value);
      // });
      this.productService.createProductConfig(productConfig).then(payload => {
        this.systemModuleService.off();
        this.btnShowStatus = true;
        this.systemModuleService.announceSweetProxy('Configuration created', 'success');
      },err=>{
        console.log(err);
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Failed to create configuration for product', 'error');
      });
    } else {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('One or more field(s) missing', 'error');
    }
  }

}
