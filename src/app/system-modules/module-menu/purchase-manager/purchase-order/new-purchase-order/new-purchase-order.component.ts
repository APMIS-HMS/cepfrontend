import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { SupplierService, StrengthService, ProductService, PurchaseOrderService, StoreService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../models/index';
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
  checkAll: FormControl = new FormControl();
  myInventory: FormControl = new FormControl();
  zeroQuantity: FormControl = new FormControl();
  reOrderLevelQuantity: FormControl = new FormControl();
  searchControl = new FormControl();
  expired = new FormControl();

  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;

  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  stores: any[] = [];
  removingRecord: boolean = false;

  loginEmployee: Employee = <Employee>{};

  saveBtnText: string = 'Done';

  constructor(private formBuilder: FormBuilder, private supplierService: SupplierService, private facilitiesService: FacilitiesService,
    private storeService: StoreService, private route: ActivatedRoute, private router: Router, private strengthService: StrengthService,
    private locker: CoolLocalStorage, private productService: ProductService, private purchaseOrderService: PurchaseOrderService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.route.data.subscribe(data => {
      data['loginEmployee'].subscribe((payload) => {
        this.loginEmployee = payload.loginEmployee;
      });
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== undefined) {
        this.getOrderDetails(id);
        this.saveBtnText = 'Update';
      }
    });

    this.getSuppliers();
    this.getAllProducts();
    this.getStores();
    this.getStrengths();
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
      this.checkAll.setValue(false);
      this.products = payload;
      this.getProductTables(this.products);
    });

    this.checkAll.valueChanges.subscribe(value => {
      if (value === true) {
        this.getAllProducts();
      } else {
        this.products = [];
        this.getProductTables(this.products);
      }
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
    console.log(event);
    console.log(value);
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
    this.productService.find({ query: { facilityId: this.selectedFacility._id, $paginate: false } }).then(payload => {
      this.products = payload;
      this.getProductTables(this.products);
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
      console.log(this.suppliers);
    });
  }
  getStrengths() {
    this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.strengths = payload.data;
      console.log(payload);
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
      console.log(purchaseOrder);
      this.purchaseOrderService.create(purchaseOrder).subscribe(payload => {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
        this.facilitiesService.announceNotification({
          type: "Success",
          text: payload.purchaseOrderNumber + " was created"
        });
      }, error => {
        console.log(error);
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
      // console.log(productRemoved);

      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
        const item = itemi.value;
        const product: any = <any>{};
        product.productId = item.id;
        product.quantity = item.qty;
        console.log(product);
        this.selectedPurchaseOrder.orderedProducts.push(product);
      });

      console.log(this.selectedPurchaseOrder);
      this.purchaseOrderService.update(this.selectedPurchaseOrder).subscribe(payload => {
        console.log(payload);
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
        this.unCheckedAllProducts();
        this.router.navigate(['/dashboard/purchase-manager/orders']);
        // (<FormArray>this.productTableForm.controls['productTableArray']).set = this.formBuilder.array([]);
      }, error => {
        console.log(error);
      });
    }
  }
  hasBeenRemoved() {
    const productRemoved: any[] = [];
    this.productTableForm.controls['productTableArray'].value.forEach((itemm, m) => {
      let isExisting = false;
      this.selectedPurchaseOrder.orderedProducts.forEach((itemi, i) => {
        if (itemi.productId === itemm.id) {
          console.log('am here');
          isExisting = true;
        }
      });
      if (isExisting === false) {
        productRemoved.push(itemm);
        console.log(productRemoved);
      }

    });
    productRemoved.forEach((itemr, r) => {
      this.selectedPurchaseOrder.orderedProducts.forEach((itemp, p) => {
        if (itemr.id === itemp.productId) {

          this.selectedPurchaseOrder.orderedProducts.splice(p, 1);
        }
      });
    });
    console.log(this.selectedPurchaseOrder.orderedProducts);
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
