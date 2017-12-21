import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import { InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService, StoreService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  Facility, InventoryTransferStatus, InventoryTransactionType, InventoryTransferTransaction,
  InventoryTransfer, Employee
} from '../../../../models/index';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {
  flyout = false;
  preview = false;
  overlay = false;

  selectedFacility: Facility = <Facility>{};
  checkingStore: any = <any>{};

  superGroups: any[] = [];
  products: any[] = [];
  productTables: any[] = [];
  stores: any[] = [];

  frmDestinationStore: FormControl = new FormControl();
  product: FormControl = new FormControl();
  productTableForm: FormGroup;
  selectedTransactionId = '';
  newTransfer: InventoryTransfer = <InventoryTransfer>{};
  selectedInventoryTransferStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  selectedInventoryTransactionType: InventoryTransactionType = <InventoryTransactionType>{};
  loginEmployee: Employee = <Employee>{};

  previewObject: any = <any>{};
  constructor(private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService,
    private route: ActivatedRoute, private storeService: StoreService,
    private locker: CoolLocalStorage, private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Stock Transfer');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.checkingStore = this.locker.getObject('checkingObject');
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

    this.newTransfer.facilityId = this.selectedFacility._id;
    this.newTransfer.storeId = this.checkingStore.typeObject.storeId;
    this.newTransfer.inventoryTransferTransactions = [];
    this.newTransfer.transferBy = this.loginEmployee._id;


    // this.route.data.subscribe(data => {
    //   data['loginEmployee'].subscribe((payload) => {
    //     this.loginEmployee = payload.loginEmployee;
    //     this.newTransfer.facilityId = this.selectedFacility._id;
    //     this.newTransfer.storeId = this.checkingStore.typeObject.storeId;
    //     this.newTransfer.inventoryTransferTransactions = [];
    //     this.newTransfer.transferBy = this.loginEmployee._id;
    //   });
    // });

    this.addNewProductTables();
    this.getMyInventory();
    this.primeComponent();
  }
  primeComponent() {
    const status$ = Observable.fromPromise(this.inventoryTransferStatusService.find({ query: { name: 'Pending' } }));
    const type$ = Observable.fromPromise(this.inventoryTransactionTypeService.find({ query: { name: 'transfer', $limit: 20 } }));
    const store$ = Observable.fromPromise(this.storeService.find({ query: { facilityId: this.selectedFacility._id, $limit: 100 } }));

    Observable.forkJoin([status$, type$, store$]).subscribe(results => {
      const statusResult: any = results[0];
      const typeResult: any = results[1];
      const storeResult: any = results[2];

      if (statusResult.data.length > 0) {
        this.selectedInventoryTransferStatus = statusResult.data[0];
      }
      if (typeResult.data.length > 0) {
        this.selectedInventoryTransactionType = typeResult.data[0];
        this.newTransfer.inventorytransactionTypeId = this.selectedInventoryTransactionType._id;
      }
      storeResult.data.forEach((store)=>{
        if(store._id !== this.checkingStore.typeObject.storeId){
          this.stores.push(store);
        }
      })
      // this.stores = storeResult.data;
    });
  }
  getMyInventory() {
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.checkingStore.typeObject.storeId
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
          batchNo: ['', [<any>Validators.required]],
          batchNumbers: [],
          costPrice: [0.00, [<any>Validators.required]],
          totalCostPrice: [0.00, [<any>Validators.required]],
          qty: ['', [<any>Validators.required]],
          expiryDate: ['', [<any>Validators.required]],
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }
  onStoreChanged() {
    this.unCheckedProducts();
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
    this.flyout = true;
  }
  onProductCheckChange(event, value, index?) {
    value.checked = event.checked;
    if (event.checked === true) {
      this.inventoryService.find({ query: { productId: value._id, facilityId: this.selectedFacility._id } }).subscribe(payload => {
        if (payload.data.length > 0) {
          (<FormArray>this.productTableForm.controls['productTableArray'])
            .push(
            this.formBuilder.group({
              product: [value.name, [<any>Validators.required]],
              batchNo: [, [<any>Validators.required]],
              batchNumbers: [payload.data[0].transactions],
              costPrice: [0.00, [<any>Validators.required]],
              totalCostPrice: [0.00, [<any>Validators.required]],
              qty: [0, [<any>Validators.required]],
              readOnly: [false],
              productObject: [value.product],
              id: [value._id],
              inventoryId: [payload.data[0]._id]
            })
            );
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
  removeProduct(index, value) {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id === value.id) {
          group.checked = false;
          this.onProductCheckChange({ checked: false }, value, index);
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 1) {
            this.addNewProductTables();
          }
        }
      });
    });
  }
  getProductQuantity($event, value, index) {
    this.selectedTransactionId = $event.value;
    const filterValue = value.filter(x => x._id === $event.value);
    if (filterValue.length > 0) {
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].setValue(filterValue[0].quantity);
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['costPrice'].setValue(filterValue[0].costPrice);
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['batchNo'].setValue(filterValue[0].batchNumber);
      const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].value;
      const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['costPrice'].value;
      const totalCost = qty * costPrice;
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['totalCostPrice'].setValue(totalCost);

    }
  }
  checkProductQuantity($event, value, index, productId) {
    const filterValue = value.filter(x => x._id === this.selectedTransactionId);
    if (filterValue.length > 0) {
      if ($event.value > filterValue[0].quantity && $event.value > 0) {
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].setValue(filterValue[0].quantity);
        const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].value;
        const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['costPrice'].value;
        const totalCost = qty * costPrice;
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['totalCostPrice'].setValue(totalCost);
      } else {
        const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].value;
        const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['costPrice'].value;
        const totalCost = qty * costPrice;
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['totalCostPrice'].setValue(totalCost);
      }
    } else {
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].setValue(0);
    }
  }
  splitProduct($event, value, index, productId) {
    const product = (<FormArray>this.productTableForm.controls['productTableArray']).controls[index].value;
    ((<FormArray>this.productTableForm.controls['productTableArray'])
      .insert(index,
      this.formBuilder.group({
        product: [product.product, [<any>Validators.required]],
        batchNo: [, [<any>Validators.required]],
        batchNumbers: [product.batchNumbers],
        costPrice: [0.00, [<any>Validators.required]],
        totalCostPrice: [0.00, [<any>Validators.required]],
        qty: [0, [<any>Validators.required]],
        readOnly: [false],
        productObject: [product.productObject],
        id: [product.id],
        inventoryId: [product.inventoryId]
      })));
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
  populateInventoryTransferTransactions() {
    this.newTransfer.inventoryTransferTransactions = [];
    this.newTransfer.destinationStoreId = this.frmDestinationStore.value;
    this.newTransfer.totalCostPrice = 0;
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      const transferTransaction: InventoryTransferTransaction = <InventoryTransferTransaction>{};
      transferTransaction.inventoryId = item.value.inventoryId;
      transferTransaction.productId = item.value.id;
      transferTransaction.quantity = item.value.qty;
      transferTransaction.costPrice = item.value.costPrice;
      transferTransaction.lineCostPrice = item.value.totalCostPrice;
      transferTransaction.transferStatusId = this.selectedInventoryTransferStatus._id;
      item.value.batchNumbers.forEach((itemm, m) => {
        if (itemm.batchNumber === item.value.batchNo) {
          transferTransaction.transactionId = itemm._id;
        }
      });
      this.newTransfer.totalCostPrice = this.newTransfer.totalCostPrice + transferTransaction.lineCostPrice;
      this.newTransfer.inventoryTransferTransactions.push(transferTransaction);
    });

    this.previewObject = <any>{};
    this.previewObject.products = [];
    this.stores.forEach((itemi, i) => {
      if (itemi._id === this.newTransfer.storeId) {
        this.previewObject.store = itemi.name;
      }
      if (itemi._id === this.newTransfer.destinationStoreId) {
        this.previewObject.destinationStore = itemi.name;
      }
    });
    this.previewObject.dateTransfer = new Date();
    this.previewObject.stockValue = this.newTransfer.totalCostPrice;
    this.previewObject.dateAccepted = 'n/a';

    this.newTransfer.inventoryTransferTransactions.forEach((itemi, i) => {
      const filterProducts = this.products.filter(x => x._id === itemi.productId);
      if (filterProducts.length > 0) {
        this.previewObject.products.push({ product: filterProducts[0].name, cost: itemi.lineCostPrice, quantity: itemi.quantity });
      }
    });
  }
  previewShow() {
    this.populateInventoryTransferTransactions();
    this.preview = !this.preview;
  }
  unCheckedProducts() {
    this.superGroups.forEach((itemi, i) => {
      itemi.forEach((itemg, g) => {
        itemg.checked = false;
      });
    });
  }
  saveTransfer() {
    this.inventoryTransferService.create(this.newTransfer).subscribe(payload => {
      (<FormArray>this.productTableForm.controls['productTableArray']).controls = [];
      this.unCheckedProducts();
    });
  }
}
