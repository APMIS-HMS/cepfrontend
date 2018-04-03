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

  public productTableForm: FormGroup;
  reorderLevel = new FormControl();
  packType = new FormControl();
  product = new FormControl();

  public showNewForm = false;

  newReorderLevel = new FormControl('', [<any>Validators.required]);
  newPackType = new FormControl(0, [<any>Validators.required]);
  newProduct = new FormControl('', [<any>Validators.required]);
  editLevel = false;
  selectedPack ={};
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
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      this.getReOrderProducts();
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
            this.collapseProductContainer = true;
            this.systemModuleService.off();
            this.products = payload.data;
          })
        }
      });
  }

  addNewProductTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: ['', [<any>Validators.required]],
          reOrderLevel: ['', [<any>Validators.required]],
          config: ['', [<any>Validators.required]],
          isEdit: [false, [<any>Validators.required]]
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }

  async onSelectProduct(product) {
    this.collapseProductContainer = false;
    this.selectedProduct = product;
    this.newProduct.setValue(product.name);
    const productSizes = await this.productService.get(product._id, { query: { loginFacilityId: this.selectedFacility._id } });
    if (productSizes.productConfigObject !== undefined) {
      this.selectedProduct.productConfigObject = productSizes.productConfigObject;
    } else {
      this.systemModuleService.announceSweetProxy('Product brand pack variant is not configured', 'error');
    }
  }

  initProductConfig(config) {
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

  getReOrderProducts() {
    this.productService.findReorder({ query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId } }).then(payload => {
      this.reorderProducts = payload.data;
    });
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

  onPackageSize(i) {
    (<FormArray>this.productTableForm['controls'].productTableArray['controls'][i]).value.reOrderLevel = 0;
    let itm = <FormArray>this.productTableForm['controls'].productTableArray['controls'][i].value.config.forEach(element => {
      (<FormArray>this.productTableForm['controls'].productTableArray['controls'][i]).value.reOrderLevel += element.size * element.packVolume;
    });
    (<FormArray>this.productTableForm.controls['productTableArray']).setValue(JSON.parse(JSON.stringify((<FormArray>this.productTableForm.controls['productTableArray']).value)));
  }

  setLevel_click() {
    // this.setLevel = !this.setLevel;
    if (this.newPackType.valid && this.newProduct.valid && this.newReorderLevel.valid) {
      const packSize = this.selectedProduct.productConfigObject.find(x => x._id.toString() === this.newPackType.value.toString());
      let reOrder: any = {};
      reOrder.productId = this.selectedProduct._id;
      reOrder.storeId = this.checkingStore.storeId;
      reOrder.facilityId = this.selectedFacility._id;
      reOrder.reOrderLevel = this.newReorderLevel.value;
      reOrder.reOrderSizeId = packSize._id;
      this.systemModuleService.on();
      this.productService.createReorder(reOrder).then(payload => {
        this.systemModuleService.off();
        this.selectedProduct = {};
        this.selectedProduct.productConfigObject = [];
        this.addBtnDisable = true;
        this.newPackType.reset();
        this.newReorderLevel.reset();
        this.newProduct.setValue(' ');
        this.systemModuleService.announceSweetProxy('Product Re-order level created successfully', 'success');
        this.getReOrderProducts();
      });
    } else {
      this.systemModuleService.announceSweetProxy('Missing field(s)', 'error');
    }
  }

  onEdit_click(product) {
    this.productService.get(product.productId, { query: { loginFacilityId: this.selectedFacility._id } }).then(payload => {
      this.editSelectedProduct = payload;
      product.isEdit = true;
    });
  }

  onSaveEdit_click(product) {
    if (this.reorderLevel.value !== null && this.reorderLevel.value !== '' && this.packType.value !== null && this.packType.value !== '') {
      this.systemModuleService.on();
      this.productService.patchReorder(product._id, { reOrderLevel: this.reorderLevel.value, reOrderSizeId: this.packType.value }).then(payload => {
        this.systemModuleService.off();
        product.isEdit = false;
        this.editSelectedProduct = {};
        this.editSelectedProduct.productConfigObject = [];
        this.addBtnDisable = true;
        this.newPackType.reset();
        this.newReorderLevel.reset();
        this.newProduct.setValue(' ');
        this.systemModuleService.announceSweetProxy('Product Re-order level updated successfully', 'success');
        this.getReOrderProducts();
      }, error => {
        this.editSelectedProduct = {};
        this.editSelectedProduct.productConfigObject = [];
        product.isEdit = false;
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing', 'error');
      });
    } else {
      product.isEdit = false;
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing', 'error');
    }
  }

  toggleNewForm(){
    this.showNewForm = !this.showNewForm;
  }

}
