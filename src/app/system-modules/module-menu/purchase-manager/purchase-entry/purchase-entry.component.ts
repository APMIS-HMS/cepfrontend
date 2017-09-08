import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import {
  SupplierService, ProductService, StoreService, PurchaseOrderService, StrengthService, PurchaseEntryService, InventoryService
} from '../../../../services/facility-manager/setup/index';
import { Facility, PurchaseOrder, PurchaseEntry, Inventory, InventoryTransaction, Employee } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';

@Component({
  selector: 'app-purchase-entry',
  templateUrl: './purchase-entry.component.html',
  styleUrls: ['./purchase-entry.component.scss']
})
export class PurchaseEntryComponent implements OnInit {

  mainErr = true;
  errMsg = 'You have unresolved errors';

  flyout = false;

  public frm_purchaseOrder: FormGroup;
  suppliers: any[] = [];
  strengths: any[] = [];
  selectedFacility: Facility = <Facility>{};
  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;
  totalCost = 0;
  orderId: any = undefined;
  invoiceId: any = undefined;

  searchControl = new FormControl();
  checkAll = new FormControl();
  zeroQuantity = new FormControl();
  reOrderLevelQuantity = new FormControl();
  myInventory = new FormControl();
  expired = new FormControl();
  productTableForm: FormGroup;
  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  stores: any[] = [];
  orders: any[] = [];

  selectedPurchaseEntry: PurchaseEntry = <PurchaseEntry>{};
  selectedOrder: PurchaseOrder = <PurchaseOrder>{};
  loginEmployee: Employee = <Employee>{};
  checkingObject: any = <any>{};
  constructor(private formBuilder: FormBuilder, private supplierService: SupplierService, private storeService: StoreService,
    private locker: CoolLocalStorage, private productService: ProductService, private purchaseOrderService: PurchaseOrderService,
    private strengthService: StrengthService, private route: ActivatedRoute, private purchaseEntryService: PurchaseEntryService,
    private inventoryService: InventoryService, private _purchaseEventEmitter: PurchaseEmitterService, private router: Router) {
  }

  ngOnInit() {
    this._purchaseEventEmitter.setRouteUrl('Purchase Entry');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.checkingObject = this.locker.getObject('checkingObject');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

    this.myInventory.valueChanges.subscribe(value => {
      if (value === true) {
        this.checkAll.setValue(false);
        this.getMyInventory();
      }
    });

    this.checkAll.valueChanges.subscribe(value => {
      if (value === true) {
        this.myInventory.setValue(false);
        this.getAllProducts();
      } else {
        if (this.myInventory.value === true) {
          this.getMyInventory();
        } else {
          this.products = [];
          this.getProductTables(this.products);
        }
      }
    });

    this.route.params.subscribe(params => {
      const id = params['id'];
      this.orderId = id;
      if (this.orderId !== undefined) {
        this.getAllProducts();
        this.getOrderDetails(this.orderId);
      }

      const invoiceId = params['invoiceId'];
      if (invoiceId !== undefined) {
        this.invoiceId = invoiceId;
        this.checkAll.setValue(true);
      }
    });


    this.getSuppliers();
    this.getStores();
    this.getStrengths();
    // this.route.data.subscribe(data => {
    //   console.log(data);
    //   data['loginEmployee'].subscribe((payload) => {
    //     this.loginEmployee = payload.loginEmployee;
    //     console.log(payload);
    //   });
    // });
    this.frm_purchaseOrder = this.formBuilder.group({
      orderId: [, []],
      store: [, [<any>Validators.required]],
      supplier: [, []],
      deliveryDate: [this.now, [<any>Validators.required]],
      invoiceNo: ['', [<any>Validators.required]],
      amount: [0.00, [<any>Validators.required]],
      desc: ['', []],
      discount: [0.00, []],
      vat: [0.00, []]
    });

    this.addNewProductTables();

    this.frm_purchaseOrder.valueChanges.subscribe(value => {
      this.mainErr = true;
      this.errMsg = '';
    });

    this.frm_purchaseOrder.controls['store'].valueChanges.subscribe(value => {
      if (value !== undefined && value !== null) {
        this.purchaseOrderService.find({ query: { storeId: value } }).subscribe(payload => {
          this.orders = payload.data;
        });
      }
    });

    this.frm_purchaseOrder.controls['orderId'].valueChanges.subscribe(value => {
      if (value !== undefined && value !== null) {
        this.purchaseOrderService.get(value, {}).subscribe(payload => {
          this.selectedOrder = payload;
          console.log(this.selectedOrder);
        });
      }
    });

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
      this.products = payload;
      this.getProductTables(this.products);
    });


  }
  getMyInventory() {
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.frm_purchaseOrder.controls['store'].value
      }
    }).subscribe(payload => {
      this.products = [];
      this.getProductTables(this.products);
      payload.data.forEach((item, i) => {
        this.products.push(item.productObject);
      });
      this.getProductTables(this.products);
    });
  }
  getInvoiceDetails(id) {
    this.purchaseEntryService.get(id, {}).then(payload => {
      this.selectedPurchaseEntry = payload;
      this.frm_purchaseOrder.controls['store'].setValue(payload.storeId);
      this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
      this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.deliveryDate);
      this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
      this.frm_purchaseOrder.controls['orderId'].setValue(payload.orderId);
      this.frm_purchaseOrder.controls['invoiceNo'].setValue(payload.invoiceNumber);
      this.frm_purchaseOrder.controls['amount'].setValue(payload.amountPaid);

      payload.products.forEach((item, i) => {
        this.inventoryService.find({
          query: {
            facilityId: this.selectedFacility._id, storeId: payload.storeId,
            productId: item.productId
          }
        })
          .subscribe(result => {
            let existingInventory = {};
            if (result.data.length > 0) {
              existingInventory = result.data[0];
            }


            this.superGroups.forEach((items, s) => {
              items.forEach((itemg, g) => {
                if (itemg._id === item.productId) {
                  itemg.checked = true;
                  let total = item.quantity * item.costPrice;
                  (<FormArray>this.productTableForm.controls['productTableArray'])
                    .push(
                    this.formBuilder.group({
                      product: [itemg.name, [<any>Validators.required]],
                      batchNo: [item.batchNo, [<any>Validators.required]],
                      costPrice: [item.costPrice, [<any>Validators.required]],
                      qty: [item.quantity, [<any>Validators.required]],
                      expiryDate: [item.expiryDate, [<any>Validators.required]],
                      total: [{value: total, disabled:true}],
                      readOnly: [false],
                      id: [item.productId],
                      existingInventory: [existingInventory],
                      productObject: [item.product],
                    })
                    );

                }

              });
            });
          });
      });
    });
  }
  getOrderDetails(id) {
    this.purchaseOrderService.get(id, {}).subscribe((payload: PurchaseOrder) => {
      this.selectedOrder = payload;
      this.frm_purchaseOrder.controls['store'].setValue(payload.storeId);
      this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
      this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.expectedDate);
      this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
      this.frm_purchaseOrder.controls['orderId'].setValue(payload._id);

      payload.orderedProducts.forEach((item, i) => {

        this.inventoryService.find({
          query: {
            facilityId: this.selectedFacility._id, storeId: payload.storeId,
            productId: item.productId
          }
        })
          .subscribe(result => {
            let existingInventory = {};
            if (result.data.length > 0) {
              existingInventory = result.data[0];
            }


            this.superGroups.forEach((items, s) => {
              items.forEach((itemg, g) => {
                if (itemg._id === item.productId) {
                  itemg.checked = true;
                  (<FormArray>this.productTableForm.controls['productTableArray'])
                    .push(
                    this.formBuilder.group({
                      product: [itemg.name, [<any>Validators.required]],
                      batchNo: ['', [<any>Validators.required]],
                      costPrice: [0, [<any>Validators.required]],
                      qty: [item.quantity, [<any>Validators.required]],
                      expiryDate: [this.now, [<any>Validators.required]],
                      readOnly: [false],
                      id: [item.productId],
                      existingInventory: [existingInventory],
                      productObject: [item.product],
                    })
                    );

                }

              });
            });
            // if (this.frm_purchaseOrder.controls['invoiceNo'].value !== null &&
            //   this.frm_purchaseOrder.controls['invoiceNo'].value.length > 0) {
            //   (<FormArray>this.productTableForm.controls['productTableArray'])
            //     .push(
            //     this.formBuilder.group({
            //       product: [value.name, [<any>Validators.required]],
            //       batchNo: ['', [<any>Validators.required]],
            //       strength: [, []],
            //       costPrice: [0.00, [<any>Validators.required]],
            //       qty: [0, [<any>Validators.required]],
            //       expiryDate: [this.now, [<any>Validators.required]],
            //       readOnly: [false],
            //       existingInventory: [existingInventory],
            //       productObject: [value.product],
            //       id: [value._id]
            //     })
            //     );
            // } else {
            //   value.checked = false;
            // }
          });
      });

    });
  }
  getStores() {
    this.storeService.find({ query: { canReceivePurchaseOrder: true, facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.stores = payload.data;
      if (this.orderId === undefined) {
        this.frm_purchaseOrder.controls['store'].setValue(this.checkingObject.typeObject.storeId);
        if (this.orderId === undefined && this.invoiceId === undefined) {
          this.myInventory.setValue(true);
        }
      }
    });
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
    if (this.superGroups.length > 0 && this.invoiceId !== undefined) {
      this.getInvoiceDetails(this.invoiceId);
    }
  }
  getCostSummary(value) {
    console.log(value);
    this.totalCost = 0;
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      const productControlValue: any = item.value;
      console.log(+productControlValue.costPrice);
      this.totalCost = this.totalCost + (+productControlValue.costPrice * +productControlValue.qty);
    });
    this.frm_purchaseOrder.controls['amount'].setValue(this.totalCost);

    // Set totalcost for each item
    let total = "₦ " + (value.value.qty * value.value.costPrice);
    console.log(total);
    value.controls['total'].setValue(total);
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
          batchNo: ['', [<any>Validators.required]],
          costPrice: ['', [<any>Validators.required]],
          total: [{value: "₦ 0", disabled:true}],
          qty: ['', [<any>Validators.required]],
          expiryDate: ['', [<any>Validators.required]],
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }
  onProductCheckChange(event, value, index?) {
    value.checked = event.checked;

    const storeId = this.frm_purchaseOrder.controls['store'].value;

    if (event.checked === true) {
      this.inventoryService.find({ query: { facilityId: this.selectedFacility._id, storeId: storeId, productId: value._id } })
        .subscribe(result => {
          let existingInventory = {};
          if (result.data.length > 0) {
            existingInventory = result.data[0];
          }
          if (this.frm_purchaseOrder.controls['invoiceNo'].value !== null &&
            this.frm_purchaseOrder.controls['invoiceNo'].value.length > 0) {
            (<FormArray>this.productTableForm.controls['productTableArray'])
              .push(
              this.formBuilder.group({
                product: [value.name, [<any>Validators.required]],
                batchNo: ['', [<any>Validators.required]],
                costPrice: [0.00, [<any>Validators.required]],
                qty: [0, [<any>Validators.required]],
                expiryDate: [this.now, [<any>Validators.required]],
                total: [{value: "₦ 0", disabled:true}],
                readOnly: [false],
                existingInventory: [existingInventory],
                productObject: [value.product],
                id: [value._id]
              })
              );
          } else {
            value.checked = false;
            this.errMsg = 'Please enter invoice number for this entry';
            this.mainErr = false;
          }
        });
    } else {
      // let indexToRemove = 0;
      // (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      //   const productControlValue: any = (<any>item).controls['id'].value;
      //   if (productControlValue === value._id) {
      //     indexToRemove = i;
      //   }
      // });
      const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
      if (count === 1) {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(index, 1);
      }
    }
  }
  removeProduct(index, schedule) {
    const value = schedule.value;
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id === value.id) {
          group.checked = false;
          this.onProductCheckChange({ checked: false }, value, index);
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 0) {
            this.addNewProductTables();
          }
        }
      });
    });
    this.getCostSummary(schedule);
  }

  create(valid, value) {
    if (valid) {
      /* purchase entry object initialization*/
      if (this.selectedPurchaseEntry._id !== undefined) {
        const purchaseEntry = this.selectedPurchaseEntry;
        purchaseEntry.amountPaid = value.amount.toString();
        purchaseEntry.deliveryDate = value.deliveryDate;
        purchaseEntry.facilityId = this.selectedFacility._id;
        purchaseEntry.invoiceNumber = value.invoiceNo;
        purchaseEntry.orderId = value.orderId;
        purchaseEntry.remark = value.desc;
        purchaseEntry.storeId = value.store;
        purchaseEntry.supplierId = value.supplier;
        purchaseEntry.createdBy = this.loginEmployee._id;

        purchaseEntry.products = [];

        /* end*/

        const inventories: any[] = [];
        const existingInventories: any[] = [];

        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
          const productObj = item.value;
          const product: any = <any>{};
          product.batchNo = productObj.batchNo;
          product.costPrice = productObj.costPrice;
          product.expiryDate = productObj.expiryDate;
          product.productId = productObj.id;
          product.quantity = productObj.qty;
          purchaseEntry.products.push(product);
          if (productObj.existingInventory !== undefined && productObj.existingInventory._id === undefined) {
            const inventory: Inventory = <Inventory>{};
            inventory.facilityId = this.selectedFacility._id;
            inventory.storeId = value.store;
            inventory.serviceId = productObj.productObject.serviceId;
            inventory.categoryId = productObj.productObject.categoryId;
            inventory.facilityServiceId = productObj.productObject.facilityServiceId;
            inventory.productId = productObj.id;
            inventory.totalQuantity = productObj.qty;
            inventory.reorderLevel = 0;
            inventory.reorderQty = 0;
            inventory.transactions = [];


            const inventoryTransaction: InventoryTransaction = <InventoryTransaction>{};
            inventoryTransaction.batchNumber = productObj.batchNo;
            inventoryTransaction.costPrice = productObj.costPrice;
            inventoryTransaction.expiryDate = productObj.expiryDate;
            inventoryTransaction.quantity = productObj.qty;
            inventory.transactions.push(inventoryTransaction);

            inventories.push(inventory);
          } else {
            if (productObj.existingInventory !== undefined) {
              delete productObj.existingInventory.productObject;
            }

            const inventory: Inventory = productObj.existingInventory;
            inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
            const inventoryTransaction: InventoryTransaction = <InventoryTransaction>{};
            inventoryTransaction.batchNumber = productObj.batchNo;
            inventoryTransaction.costPrice = productObj.costPrice;
            inventoryTransaction.expiryDate = productObj.expiryDate;
            inventoryTransaction.quantity = productObj.qty;
            inventory.transactions.push(inventoryTransaction);

            existingInventories.push(inventory);
          }
        });
        this.purchaseEntryService.update(purchaseEntry).then(payload => {
          payload.products.forEach((pl, ip) => {
            inventories.forEach((itemi, i) => {
              itemi.transactions.forEach((itemt, t) => {
                itemt.purchaseEntryId = payload._id;
                itemt.purchaseEntryDetailId = pl._id;
              });
            });

            existingInventories.forEach((itemi, i) => {
              if (itemi.transactions.length > 0) {
                const transactionLength = itemi.transactions.length;
                const index = transactionLength - 1;
                const lastTransaction = itemi.transactions[index];
                lastTransaction.purchaseEntryId = payload._id;
                lastTransaction.purchaseEntryDetailId = pl._id;
              }
            });
          });
          if (inventories.length > 0) {
            this.inventoryService.create(inventories).subscribe(payResult => {
              this.frm_purchaseOrder.controls['invoiceNo'].reset();
              this.getAllProducts();
              this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
              this.router.navigate(['dashboard/purchase-manager/invoices']);
            });
          }
          if (existingInventories.length > 0) {
            existingInventories.forEach((ivn, iv) => {
              this.inventoryService.update(ivn).subscribe(payResult => {
                this.frm_purchaseOrder.controls['invoiceNo'].reset();
                this.getAllProducts();
                this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
                this.router.navigate(['dashboard/purchase-manager/invoices']);
              });
            });

          }
        });
      } else {
        const purchaseEntry: PurchaseEntry = <PurchaseEntry>{};
        purchaseEntry.amountPaid = value.amount.toString();
        purchaseEntry.deliveryDate = value.deliveryDate;
        purchaseEntry.facilityId = this.selectedFacility._id;
        purchaseEntry.invoiceNumber = value.invoiceNo;
        purchaseEntry.orderId = value.orderId;
        purchaseEntry.remark = value.desc;
        purchaseEntry.storeId = value.store;
        purchaseEntry.supplierId = value.supplier;
        purchaseEntry.createdBy = this.loginEmployee._id;

        purchaseEntry.products = [];

        /* end*/

        const inventories: any[] = [];
        const existingInventories: any[] = [];

        (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
          const productObj = item.value;
          const product: any = <any>{};
          product.batchNo = productObj.batchNo;
          product.costPrice = productObj.costPrice;
          product.expiryDate = productObj.expiryDate;
          product.productId = productObj.id;
          product.quantity = productObj.qty;
          purchaseEntry.products.push(product);
          if (productObj.existingInventory !== undefined && productObj.existingInventory._id === undefined) {
            const inventory: Inventory = <Inventory>{};
            inventory.facilityId = this.selectedFacility._id;
            inventory.storeId = value.store;
            inventory.serviceId = productObj.productObject.serviceId;
            inventory.categoryId = productObj.productObject.categoryId;
            inventory.facilityServiceId = productObj.productObject.facilityServiceId;
            inventory.productId = productObj.id;
            inventory.totalQuantity = productObj.qty;
            inventory.reorderLevel = 0;
            inventory.reorderQty = 0;
            inventory.transactions = [];


            const inventoryTransaction: InventoryTransaction = <InventoryTransaction>{};
            inventoryTransaction.batchNumber = productObj.batchNo;
            inventoryTransaction.costPrice = productObj.costPrice;
            inventoryTransaction.expiryDate = productObj.expiryDate;
            inventoryTransaction.quantity = productObj.qty;
            inventory.transactions.push(inventoryTransaction);

            inventories.push(inventory);
          } else {
            if (productObj.existingInventory !== undefined) {
              delete productObj.existingInventory.productObject;
            }

            const inventory: Inventory = productObj.existingInventory;
            inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
            const inventoryTransaction: InventoryTransaction = <InventoryTransaction>{};
            inventoryTransaction.batchNumber = productObj.batchNo;
            inventoryTransaction.costPrice = productObj.costPrice;
            inventoryTransaction.expiryDate = productObj.expiryDate;
            inventoryTransaction.quantity = productObj.qty;
            inventory.transactions.push(inventoryTransaction);

            existingInventories.push(inventory);
          }
        });
        this.purchaseEntryService.create(purchaseEntry).then(payload => {
          payload.products.forEach((pl, ip) => {
            inventories.forEach((itemi, i) => {
              itemi.transactions.forEach((itemt, t) => {
                itemt.purchaseEntryId = payload._id;
                itemt.purchaseEntryDetailId = pl._id;
              });
            });

            existingInventories.forEach((itemi, i) => {
              if (itemi.transactions.length > 0) {
                const transactionLength = itemi.transactions.length;
                const index = transactionLength - 1;
                const lastTransaction = itemi.transactions[index];
                lastTransaction.purchaseEntryId = payload._id;
                lastTransaction.purchaseEntryDetailId = pl._id;
              }
            });
          });
          if (inventories.length > 0) {
            this.inventoryService.create(inventories).subscribe(payResult => {
              this.frm_purchaseOrder.controls['invoiceNo'].reset();
              this.getAllProducts();
              this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
              this.router.navigate(['dashboard/purchase-manager/invoices']);
            });
          }
          if (existingInventories.length > 0) {
            existingInventories.forEach((ivn, iv) => {
              this.inventoryService.update(ivn).subscribe(payResult => {
                this.frm_purchaseOrder.controls['invoiceNo'].reset();
                this.getAllProducts();
                this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
                this.router.navigate(['dashboard/purchase-manager/invoices']);
              });
            });

          }
        });
      }
    } else {
      this.mainErr = false;
    }
  }

  cancelAll() {
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
    this.frm_purchaseOrder.controls['supplier'].setValue('');
    this.frm_purchaseOrder.controls['desc'].setValue('');
    this.frm_purchaseOrder.controls['orderId'].reset();
    this.superGroups[0].forEach((item, i) => {
      item.checked = false;
    });
    this.selectedOrder = <PurchaseOrder>{};
  }

  flyout_toggle(e) {
    console.log(this.selectedOrder);
    if (this.selectedOrder === undefined || this.selectedOrder._id === undefined) {
      this.flyout = !this.flyout;
    }
    //e.stopPropagation();
  }
  flyout_close(e) {
    if (this.flyout === true) {
      this.flyout = false;
    }
  }
  

}
