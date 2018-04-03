import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
// tslint:disable-next-line:max-line-length
import { StoreService, ProductService, StrengthService, ProductRequisitionService, EmployeeService, InventoryService } from '../../../../services/facility-manager/setup/index';
import { Facility, Requisition, RequisitionProduct, Employee } from '../../../../models/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss']
})
export class RequisitionComponent implements OnInit {
  mainErr = true;
  errMsg = 'You have unresolved errors';

  flyout = false;

  public frm_purchaseOrder: FormGroup;

  suppliers: any[] = [];

  productTableForm: FormGroup;
  checkAll: FormControl = new FormControl();
  zeroQuantity: FormControl = new FormControl();
  reOrderLevelQuantity: FormControl = new FormControl();
  searchControl = new FormControl();
  productsControl = new FormControl();
  desc = new FormControl();
  checkBoxLabel = [];
  isChecked = false;
  indexChecked = 0;
  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;

  stores: any[] = [];
  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  strengths: any[] = [];
  removingRecord = false;

  selectedFacility: Facility = <Facility>{};
  checkingObject: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  constructor(
    private formBuilder: FormBuilder,
    private _inventoryEventEmitter: InventoryEmitterService,
    private storeService: StoreService,
    private locker: CoolLocalStorage,
    private productService: ProductService,
    private strengthService: StrengthService,
    private employeeService: EmployeeService,
    private requisitionService: ProductRequisitionService,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private inventoryService: InventoryService
  ) {

    this.employeeService.checkInAnnounced$.subscribe(payload => {
      if (payload !== undefined) {
        this.stores = [];
        if (payload.typeObject !== undefined) {
          this.checkingObject = payload.typeObject;
          this.getStores();
        }
      }
    });
  }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Requisition');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');
    this.checkBoxLabel = [{ name: 'All', checked: true }, { name: 'Out of stock', checked: false },
    { name: 'Re-order Level', checked: false }];
    this.frm_purchaseOrder = this.formBuilder.group({
      product: ['', [<any>Validators.required]],
      supplier: ['', [<any>Validators.required]],
      deliveryDate: [this.now, [<any>Validators.required]],
      desc: ['', [<any>Validators.required]],
    });
    this.addNewProductTables();
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingObject = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      const emp$ = Observable.fromPromise(this.employeeService.find({
        query: {
          facilityId: this.selectedFacility._id, personId: auth.data.personId
        }
      }));
      emp$.mergeMap((emp: any) => Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
      ]))
        .subscribe((results: any) => {
          this.loginEmployee = results[0];
        });
      this.getStores();
      this.getAllProducts();
      this.getStrengths();
    });
  }

  getStores() {
    this.stores = [];
    this.storeService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload =>
      payload.data.forEach((item, i) => {
        if (item._id !== this.checkingObject.storeId) {
          this.stores.push(item);
        }
      }))
    }

  getAllProducts() {
    this.systemModuleService.on();
    this.productService.find({ query: { loginFacilityId: this.selectedFacility._id, $limit: false } }).then(payload => {
      this.products = payload.data;
      this.getProductTables(this.products);
      this.systemModuleService.off();
    });
  }
  getProductTables(products: any[]) {
    this.productTables = products;
    this.superGroups = [];
    let group: any[] = [];

    let counter = 0;
    for (let i = 0; i < this.productTables.length; i++) {

      if (this.superGroups.length < 1) {
        group = [];
        let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id, product: this.productTables[i] };
        obj = this.mergeTable(obj);
        group.push(obj);
        this.superGroups.push(group);
      } else {
        if (counter < 1) {
          let obj = <any>{
            checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id,
            product: this.productTables[i]
          };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        } else {
          counter = 0;
          let obj = <any>{
            checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id,
            product: this.productTables[i]
          };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        }

      }
    }
  }

  mergeTable(obj) {
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      const productControlValue: any = (<any>item).controls['id'].value;
      if (productControlValue === obj._id) {
        obj.checked = true;
      }
    });
    return obj;
  }
  addNewProductTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: ['', [<any>Validators.required]],
          qty: ['', [<any>Validators.required]],
          config: new FormArray([]),
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }
  getStrengths() {
    this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.strengths = payload.data;
    });
  }
  onProductCheckChange(event, value) {
    value.checked = event.checked;

    // let storeId = this.frm_purchaseOrder.controls['store'].value;

    if (event.checked === true) {
      if (this.productsControl.value !== null && this.productsControl.value !== undefined) {
        (<FormArray>this.productTableForm.controls['productTableArray'])
          .push(
          this.formBuilder.group({
            product: [value.name, [<any>Validators.required]],
            qty: [0, [<any>Validators.required]],
            config: this.initProductConfig(value.product.productConfigObject),
            readOnly: [false],
            productObject: [value.product],
            id: [value._id]
          })
          );
      } else {
        value.checked = false;
        this.errMsg = 'Please select the destination store';
        this.mainErr = false;
      }
    } else {
      let indexToRemove = 0;
      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
        const productControlValue: any = (<any>item).controls['id'].value;
        if (productControlValue === value._id) {
          indexToRemove = i;
        }
      });
      const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
      if (count === 1) {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(indexToRemove, 1);
      }
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

  getProductConfig(form) {
    return form.controls.config.controls;
  }

  onPackageSize(i) {
    (<FormArray>this.productTableForm['controls'].productTableArray['controls'][i]).value.qty = 0;
    let itm = <FormArray>this.productTableForm['controls'].productTableArray['controls'][i].value.config.forEach(element => {
      (<FormArray>this.productTableForm['controls'].productTableArray['controls'][i]).value.qty += element.size * element.packVolume;
    });
    (<FormArray>this.productTableForm.controls['productTableArray']).setValue(JSON.parse(JSON.stringify((<FormArray>this.productTableForm.controls['productTableArray']).value)));
  }

  removeProduct(index, value) {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id === value.id) {
          group.checked = false;
          this.onProductCheckChange({ checked: false }, value);
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 1) {
            // this.addNewProductTables();
          }
        }
      });
    });
  }
  resetGroups() {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        group.checked = false;
      });
    });
  }
  save() {
    const requisition: Requisition = <Requisition>{};
    requisition.employeeId = this.loginEmployee._id;
    requisition.facilityId = this.selectedFacility._id;
    requisition.storeId = this.checkingObject.storeId;
    requisition.comment = this.desc.value;
    requisition.products = [];
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
      const requisitionProduct: RequisitionProduct = <RequisitionProduct>{};
      requisitionProduct.productId = item.value.productObject._id;
      requisitionProduct.qty = item.value.qty;
      requisition.products.push(requisitionProduct);
    });
    this.requisitionService.create(requisition).then(payload => {
      this.systemModuleService.announceSweetProxy('Requisition successfull', 'success', null, null, null, null, null, null, null);
      this.addNewProductTables();
      this.desc.reset();
      this.resetGroups();
    }, err => {
      this.systemModuleService.announceSweetProxy('Requisition failed', 'error');
    });
  }

  flyout_toggle(e) {
    this.flyout = !this.flyout;
    // e.stopPropagation();
  }
  flyout_close(e) {
    if (this.flyout === true) {
      this.flyout = false;
    }
  }

  getInventories() {
    this.systemModuleService.on();
    this.products = [];
    if (this.checkingObject !== null) {
      this.inventoryService.findList({
        query:
          { facilityId: this.selectedFacility._id, name: '', storeId: this.checkingObject.storeId }// , $limit: 200 }
      })
        .then(payload => {
          const products = payload.data.filter(x => x.availableQuantity === 0);
          products.forEach(element => {
            this.products.push(element.productObject);
            this.getProductTables(this.products);
          });
          this.systemModuleService.off();
        });
    }

  }

  onChecked(e, item, checkBoxLabel, i) {
    item.checked = e.checked;
    this.products = [];
    this.getProductTables(this.products);
    if (e.checked) {
      if (i === 0) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[2].checked = false;
        this.getAllProducts();
      } else if (i === 1) {
        checkBoxLabel[0].checked = false;
        checkBoxLabel[2].checked = false;
        this.getInventories();
      } else if (i === 2) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[0].checked = false;
        this.products = [];
        this.getProductTables(this.products);
      }
    } else {
      checkBoxLabel[0].checked = false;
      checkBoxLabel[1].checked = false;
      checkBoxLabel[2].checked = false;
      this.products = [];
      this.getProductTables(this.products);
    }
  }
}
