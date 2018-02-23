import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
  SupplierService, StrengthService, ProductService, PurchaseOrderService, StoreService,
  FacilitiesService, EmployeeService, InventoryService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../models/index';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PurchaseOrder } from '../../../../../models/index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-new-purchase-order',
  templateUrl: './new-purchase-order.component.html',
  styleUrls: ['./new-purchase-order.component.scss']
})
export class NewPurchaseOrderComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  flyout = false;

  public frm_purchaseOrder: FormGroup;

  suppliers: any[] = [];
  strengths: any[] = [];
  selectedFacility: Facility = <Facility>{};
  selectedPurchaseOrder: PurchaseOrder = <PurchaseOrder>{};

  productTableForm: FormGroup;
  checkingObject: any = <any>{};
  searchControl = new FormControl();

  checkBoxLabels = [];

  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;

  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  stores: any[] = [];
  removingRecord = false;

  loginEmployee: Employee = <Employee>{};

  saveBtnText = 'Done';

  constructor(private formBuilder: FormBuilder, private supplierService: SupplierService,
    private facilitiesService: FacilitiesService,
    private storeService: StoreService, private route: ActivatedRoute, private router: Router,
    private strengthService: StrengthService,
    private locker: CoolLocalStorage, private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private systemModuleService: SystemModuleService,
    private authFacadeService: AuthFacadeService,
    private employeeService: EmployeeService,
    private inventoryService: InventoryService) {
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
    this.checkBoxLabels = [{ name: 'All', checked: true }, { name: 'Out of stock', checked: false },
    { name: 'Re-order Level', checked: false }, { name: 'Expired', checked: false }];
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');

    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingObject = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);

      this.getStores();
      this.getAllProducts();
      this.getStrengths();
      this.getSuppliers();
      this.route.params.subscribe(params => {
        const id = params['id'];
        if (id !== undefined) {
          this.getOrderDetails(id);
          this.saveBtnText = 'Update';
        }
      });
    });

    // this.getStrengths();
    this.frm_purchaseOrder = this.formBuilder.group({
      product: ['', [<any>Validators.required]],
      store: ['', [<any>Validators.required]],
      supplier: ['', [<any>Validators.required]],
      deliveryDate: [this.now, [<any>Validators.required]],
      desc: ['', [<any>Validators.required]],
    });
    this.addNewProductTables();


    const productObs = this.searchControl.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((term: any[]) => this.productService.find({
        query: {
          facilityId: this.selectedFacility._id,
          name: { $regex: this.searchControl.value, '$options': 'i' },
          $paginate: false
        }
      }));

    productObs.subscribe((payload: any) => {
      this.checkBoxLabels[0].checked = false;
      this.products = payload;
      this.getProductTables(this.products);
    });
  }

  getOrderDetails(id) {
    this.purchaseOrderService.get(id, {}).subscribe((payload: PurchaseOrder) => {
      this.selectedPurchaseOrder = payload;
      this.frm_purchaseOrder.controls['store'].setValue(payload.storeId);
      this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
      this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.expectedDate);
      this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
      payload.orderedProducts.forEach((item, i) => {
        this.superGroups.forEach((items, s) => {
          items.forEach((itemg, g) => {
            if (itemg._id === item.productId) {
              itemg.checked = true;
              this.flyout = true;

              (<FormArray>this.productTableForm.controls['productTableArray'])
                .push(
                this.formBuilder.group({
                  product: [itemg.name, [<any>Validators.required]],
                  qty: [item.quantity, [<any>Validators.required]],
                  readOnly: [false],
                  id: [item.productId]
                })
                );

            }

          });
        });
      });

    });
  }
  getStores() {
    this.storeService.find({ query: { canReceivePurchaseOrder: true, facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.stores = payload.data;
    });
  }
  onProductCheckChange(event, value) {
    value.checked = event.checked;
    if (event.checked === true) {
      (<FormArray>this.productTableForm.controls['productTableArray'])
        .push(
        this.formBuilder.group({
          product: [value.name, [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          readOnly: [false],
          id: [value._id]
        })
        );
    } else {
      let indexToRemove = 0;
      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
        const productControlValue: any = (<any>item).controls['id'].value;
        if (productControlValue === value._id || productControlValue === value.id) {
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
  removeProduct(index, value) {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {

        if (group._id === value.id) {
          group.checked = false;
          if (true) {
            const event: any = { checked: false };
            this.onProductCheckChange(event, value);
          }
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 0) {
            this.addNewProductTables();
          }
        }
      });
    });
  }
  unCheckedAllProducts() {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        group.checked = false;
        if (this.selectedPurchaseOrder._id !== undefined) {
          const event: any = { checked: false };
          // this.onProductCheckChange(event, value);
        }
        const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
        if (count === 1) {
          this.addNewProductTables();
        }
      });
    });
  }
  login(valid) {
    if (valid) {

    } else {
      this.mainErr = false;
    }
  }
  getAllProducts() {
    this.systemModuleService.on();
    this.productService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.products = payload.data;
      this.getProductTables(this.products);
      this.systemModuleService.off();
    }, err => {
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
        let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
        obj = this.mergeTable(obj);
        group.push(obj);
        this.superGroups.push(group);
      } else {
        if (counter < 1) {
          let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        } else {
          counter = 0;
          let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
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
  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id }, $paginate: false }).then(payload => {
      this.suppliers = payload.data;
    });
  }
  getStrengths() {
    this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.strengths = payload.data;
    });
  }
  addNewProductTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: ['', [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
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
        checkBoxLabel[3].checked = false;
        this.getAllProducts();
      } else if (i === 1) {
        checkBoxLabel[0].checked = false;
        checkBoxLabel[2].checked = false;
        checkBoxLabel[3].checked = false;
        this.getInventories();
      } else if (i === 2) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[0].checked = false;
        checkBoxLabel[3].checked = false;
        this.products = [];
        this.getProductTables(this.products);
      }
      // tslint:disable-next-line:one-line
      else if (i === 3) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[0].checked = false;
        checkBoxLabel[2].checked = false;
        this.products = [];
        this.getProductTables(this.products);
      }
    } else {
      checkBoxLabel[0].checked = false;
      checkBoxLabel[1].checked = false;
      checkBoxLabel[2].checked = false;
      checkBoxLabel[3].checked = false;
      this.products = [];
      this.getProductTables(this.products);
    }
  }
  save() {
    this.flyout = false;
    if (this.saveBtnText === 'Done') {
      const purchaseOrder: PurchaseOrder = <PurchaseOrder>{};
      purchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
      purchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
      purchaseOrder.remark = this.frm_purchaseOrder.value.desc;
      purchaseOrder.storeId = this.frm_purchaseOrder.value.store;
      purchaseOrder.facilityId = this.selectedFacility._id;
      purchaseOrder.createdBy = this.loginEmployee._id;

      purchaseOrder.orderedProducts = [];
      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
        const item = itemi.value;
        const product: any = <any>{};
        product.productId = item.id;
        product.quantity = item.qty;
        purchaseOrder.orderedProducts.push(product);
      });
      this.purchaseOrderService.create(purchaseOrder).subscribe(payload => {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
        this.systemModuleService.announceSweetProxy('Purchase order ' + payload.purchaseOrderNumber + ' was created', 'success');
      }, error => {
        this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
      });
    } else {
      this.selectedPurchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
      this.selectedPurchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
      this.selectedPurchaseOrder.remark = this.frm_purchaseOrder.value.desc;
      this.selectedPurchaseOrder.storeId = this.frm_purchaseOrder.value.store;
      this.selectedPurchaseOrder.facilityId = this.selectedFacility._id;
      this.selectedPurchaseOrder.createdBy = this.loginEmployee._id;

      this.selectedPurchaseOrder.orderedProducts = [];
      // let productRemoved = this.hasBeenRemoved();

      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
        const item = itemi.value;
        const product: any = <any>{};
        product.productId = item.id;
        product.quantity = item.qty;
        this.selectedPurchaseOrder.orderedProducts.push(product);
      });

      this.purchaseOrderService.patch(this.selectedPurchaseOrder._id, this.selectedPurchaseOrder).subscribe(payload => {
        this.systemModuleService.announceSweetProxy('Purchase order ' + payload.purchaseOrderNumber + ' was updated', 'success');
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
        this.unCheckedAllProducts();
        this.router.navigate(['/dashboard/purchase-manager/orders']);
        // (<FormArray>this.productTableForm.controls['productTableArray']).set = this.formBuilder.array([]);
      }, error => {
        this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
      });
    }
  }
  hasBeenRemoved() {
    const productRemoved: any[] = [];
    this.productTableForm.controls['productTableArray'].value.forEach((itemm, m) => {
      let isExisting = false;
      this.selectedPurchaseOrder.orderedProducts.forEach((itemi, i) => {
        if (itemi.productId === itemm.id) {
          isExisting = true;
        }
      });
      if (isExisting === false) {
        productRemoved.push(itemm);
      }

    });
    productRemoved.forEach((itemr, r) => {
      this.selectedPurchaseOrder.orderedProducts.forEach((itemp, p) => {
        if (itemr.id === itemp.productId) {

          this.selectedPurchaseOrder.orderedProducts.splice(p, 1);
        }
      });
    });
    return productRemoved;
  }
  flyout_toggle(e) {
    this.flyout = !this.flyout;
    e.stopPropagation();
  }
  flyout_close(e) {
    if (this.flyout === true) {
      this.flyout = false;
    }
  }
}
