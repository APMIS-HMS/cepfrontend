import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { StoreService, ProductService, InventoryService, EmployeeService } from '../../../../services/facility-manager/setup/index';
import { ProductConfig } from '../../../../models/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reorder-level',
  templateUrl: './reorder-level.component.html',
  styleUrls: ['./reorder-level.component.scss']
})
export class ReorderLevelComponent implements OnInit {

  productTableForm: FormGroup;
  reorderLevel = new FormControl();
  packType = new FormControl();
  product = new FormControl();

  public showNewForm = false;

  newReorderLevel = new FormControl('', [<any>Validators.required]);
  newPackType = new FormControl(0, [<any>Validators.required]);
  newProduct = new FormControl('', [<any>Validators.required]);
  editLevel = false;
  selectedPack = {};
  selectedFacility: any = <any>{};
  products = <any>[];
  reorderProducts = <any>[];

  user: any = <any>{};
  loginEmployee: any = <any>{};
  checkingStore: any = <any>{};

  collapseProductContainer = false;
  selectedProduct: any = <any>{};
  editSelectedProduct: any = <any>{};

  addBtnDisable = true;

  constructor(
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService,
    private employeeService: EmployeeService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.user = this.locker.getObject('auth');
    this.initializeReorderProperties();
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      this.setExistingReorderData();
    });
    this.newProduct.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        if (this.products.filter(x => x.name === this.newProduct.value).length === 1 || this.newProduct.value === ' ') {
          this.collapseProductContainer = false;
        } else {
          this.systemModuleService.on();
          this.productService.findReorderUnique({
            query:
              { facilityId: this.selectedFacility._id, name: this.newProduct.value, storeId: this.checkingStore.storeId }
          }).then(payload => {
            console.log(payload);
            this.collapseProductContainer = true;
            this.systemModuleService.off();
            this.products = payload.data;
          })
        }
      });
  }

  initializeReorderProperties() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: [{}, [<any>Validators.required]],
          reOrderLevel: [0, [<any>Validators.required]],
          packTypeId: ['', [<any>Validators.required]],
          productItemConfigObject: [{}, [<any>Validators.required]],
          isEdit: [false, [<any>Validators.required]],
          id: ['', [<any>Validators.required]]
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }


  setExistingReorderData() {
    console.log(this.checkingStore);
    this.productService.findReorder({ query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId } }).then(payload => {
      console.log(payload);
      this.reorderProducts = payload.data.forEach(element => {
        if(element.productConfigObject !== undefined){
          console.log(element);
          element.productObject.productConfigObject = element.productConfigObject;
          (<FormArray>this.productTableForm.controls['productTableArray']).push(
            this.formBuilder.group({
              product: [element.productObject, [<any>Validators.required]],
              reOrderLevel: [element.reOrderLevel, [<any>Validators.required]],
              packTypeId: [element.productItemConfigObject._id, [<any>Validators.required]],
              productItemConfigObject: [element.productItemConfigObject, [<any>Validators.required]],
              isEdit: [false, [<any>Validators.required]],
              id: [element._id]
            }));
        }
      });
    });
  }

  async onSelectProduct(product) {
    this.collapseProductContainer = false;
    this.selectedProduct = product;
    this.newProduct.setValue(product.name);
    const productConfigSizes = await this.productService.findProductConfigs({query:{productId:product.id}});
    if (productConfigSizes.data[0] !== undefined) {
      this.selectedProduct.productConfigObject = productConfigSizes.data[0].packSizes;
    } else {
      this.systemModuleService.announceSweetProxy('Product brand pack variant is not configured', 'error');
    }
  }

  isReorderUniqueProducts(productId) {
    this.productService.findReorder({ query: { productId: productId } }).then(payload => {
      if (payload.data !== undefined && payload.data.length > 0) {
        return true;
      } else {
        return false;
      }
    });
  }

  getProductConfig(form) {
    return form.controls.config.controls;
  }

  comparePack(l1: any, l2: any) {
    return l1.includes(l2);
  }
  
  setLevel_click() {
    // this.setLevel = !this.setLevel;
    console.log(this.checkingStore);
    if (this.newPackType.valid && this.newProduct.valid && this.newReorderLevel.valid) {
      const packSize = this.selectedProduct.productConfigObject.find(x => x._id.toString() === this.newPackType.value.toString());
      let reOrder: any = {};
      reOrder.productId = this.selectedProduct.id;
      reOrder.storeId = this.checkingStore.storeId;
      reOrder.facilityId = this.selectedFacility._id;
      reOrder.reOrderLevel = this.newReorderLevel.value;
      reOrder.reOrderSizeId = packSize._id;
      this.systemModuleService.on();
      this.productService.createReorder(reOrder).then(payload => {
        this.systemModuleService.off();
        this.addBtnDisable = true;
        this.newPackType.reset();
        this.newReorderLevel.reset();
        this.newProduct.setValue(' ');
        this.initializeReorderProperties();
        this.systemModuleService.announceSweetProxy('Product Re-order level created successfully', 'success');
       this.setExistingReorderData();
      });
    } else {
      this.systemModuleService.announceSweetProxy('Missing field(s)', 'error');
    }
  }

  onEdit_click(form) {
    form.value.isEdit = !form.value.isEdit;
    form.setValue(JSON.parse(JSON.stringify(form.value)));
  }

  onSaveEdit_click(form) {
    if (form.valid) {
      this.systemModuleService.on();
      this.productService.patchReorder(form.value.id, { reOrderLevel: form.value.reOrderLevel, reOrderSizeId: form.value.packTypeId }).then(payload => {
        this.systemModuleService.off();
        this.initializeReorderProperties();
        this.systemModuleService.announceSweetProxy('Product Re-order level updated successfully', 'success');
        this.setExistingReorderData();
      }, error => {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing--3', 'error');
      });
    } else {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing', 'error');
    }
  }

  toggleNewForm() {
    this.showNewForm = !this.showNewForm;
  }

}
