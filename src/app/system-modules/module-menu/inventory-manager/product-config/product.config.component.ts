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
    var x = document.getElementById("searchuctControl")
    // console.log(x);
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

  removePack(i: number, itm: any) {
    const control = <FormArray>this.packageForm.controls['package'];
    let _packages = this.packages;
    console.log(_packages);
    console.log(itm.value);
    _packages.forEach(item => {
      if (item._id.toString() === itm.value.id.toString()) {
        item.checked = false;
      }
    });
    this.packages = JSON.parse(JSON.stringify(_packages));
    control.removeAt(i);
  }

  getPackagesizes() {
    this.productService.findPackageSize({}).then(payload => {
      this.packages = payload.data;
      this.packages.forEach(element => {
        element.checked = false;
      });
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
    item.checked = event.target.checked;
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
      console.log(1);
      let indexToRemove = 0;
      (<FormArray>this.packageForm.controls['package']).controls.forEach((item: any, i) => {
        const packagelValue: any = (<any>item).controls['id'].value;
        console.log(item.value);
        if (packagelValue.toString() === item.value.id.toString()) {
          indexToRemove = i;
        }
      });
      const count = (<FormArray>this.packageForm.controls['package']).controls.length;
      if (count === 1) {
        this.packageForm.controls['package'] = this._fb.array([]);
      } else {
        (<FormArray>this.packageForm.controls['package']).removeAt(indexToRemove);
      }
    }
  }

  createPackage(item): FormGroup {
    return this._fb.group({
      name: [item.name, Validators.required],
      size: [0, Validators.required]
    });
  }

  onMoveDown(i, item) {
    if (i + 1 < (<FormArray>this.packageForm.controls['package']).length) {
      (<FormArray>this.packageForm.controls['package']).value[i] = (<FormArray>this.packageForm.controls['package']).value[i + 1];
      (<FormArray>this.packageForm.controls['package']).value[i + 1] = item.value;
      (<FormArray>this.packageForm.controls['package']).setValue(JSON.parse(JSON.stringify((<FormArray>this.packageForm.controls['package']).value)));
    } else {
      this.systemModuleService.announceSweetProxy('Cannot move item out of range', 'error');
    }
  }

  onMoveUp(i, item) {
    if (i > 0) {
      (<FormArray>this.packageForm.controls['package']).value[i] = (<FormArray>this.packageForm.controls['package']).value[i - 1];
      (<FormArray>this.packageForm.controls['package']).value[i - 1] = item.value;
      (<FormArray>this.packageForm.controls['package']).setValue(JSON.parse(JSON.stringify((<FormArray>this.packageForm.controls['package']).value)));
    } else {
      this.systemModuleService.announceSweetProxy('Cannot move item out of range', 'error');
    }
  }

  save() {
    if ((<FormArray>this.packageForm.controls['package']).valid) {
      this.btnShowStatus = false;
      this.systemModuleService.on();
      let productConfig: any = {};
      productConfig.productId = this.selectedProduct._id;
      productConfig.facilityId = this.selectedFacility._id;
      productConfig.packSizes = (<FormArray>this.packageForm.controls['package']).value;
      this.productService.createProductConfig(productConfig).then(payload => {
        this.systemModuleService.off();
        this.btnShowStatus = true;
        this.packageForm.controls['package'] = this._fb.array([]);
        this.packages = JSON.parse(JSON.stringify(this.packages));
        this.selectedProduct = {};

        this.systemModuleService.announceSweetProxy('Configuration created', 'success');
      }, err => {
        console.log(err);
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Failed to create configuration for product', 'error');
      });//.path["0"].value
    } else {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('One or more field(s) missing', 'error');
    }
  }

  onChange(event) {
    console.log(event);
  }

}
