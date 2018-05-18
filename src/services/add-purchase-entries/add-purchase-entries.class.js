/* eslint-disable no-unused-vars */
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  async create(data, params) {
    const inventoriesService = this.app.service('inventories');
    const purchaseEntriesService = this.app.service('purchase-entries');
    const makePurchaseEntriesService = this.app.service('make-purchase-entries');

    if (data.selectedPurchaseEntry._id !== undefined) {
      const purchaseEntry = data.selectedPurchaseEntry;
      purchaseEntry.invoiceAmount = data.amount.toString();
      purchaseEntry.deliveryDate = data.deliveryDate;
      purchaseEntry.facilityId = data.selectedFacility._id;
      purchaseEntry.invoiceNumber = data.invoiceNo;
      purchaseEntry.orderId = data.orderId;
      purchaseEntry.remark = data.desc;
      purchaseEntry.storeId = data.store;
      purchaseEntry.supplierId = data.supplier;
      purchaseEntry.createdBy = data.createdBy;

      purchaseEntry.products = [];

      /* end*/

      const inventories = [];
      const existingInventories = [];

      data.productForms.forEach((item, i) => {
        const productObj = item.value;
        const product = {};
        product.batchNo = productObj.batchNo;
        product.costPrice = productObj.costPrice;
        product.expiryDate = productObj.expiryDate;
        product.productId = productObj.productObject.id;
        product.quantity = productObj.qty;
        product.availableQuantity = productObj.qty;
        purchaseEntry.products.push(product);
        if (productObj.existingInventory !== undefined && productObj.existingInventory._id === undefined) {
          const inventory = {};
          inventory.facilityId = data.facilityId;
          inventory.storeId = data.store;
          inventory.serviceId = productObj.productObject.serviceId;
          inventory.categoryId = productObj.productObject.categoryId;
          inventory.facilityServiceId = productObj.productObject.facilityServiceId;
          inventory.productId = productObj.productObject.id;
          inventory.totalQuantity = productObj.qty;
          inventory.availableQuantity = productObj.qty;
          inventory.reorderLevel = 0;
          inventory.reorderQty = 0;
          inventory.transactions = [];


          const inventoryTransaction = {};
          inventoryTransaction.batchNumber = productObj.batchNo;
          inventoryTransaction.costPrice = productObj.costPrice;
          inventoryTransaction.expiryDate = productObj.expiryDate;
          inventoryTransaction.quantity = productObj.qty;
          inventoryTransaction.availableQuantity = productObj.qty;
          inventory.transactions.push(inventoryTransaction);

          inventories.push(inventory);
        } else {
          if (productObj.existingInventory !== undefined) {
            delete productObj.existingInventory.productObject;
          }

          const inventory = productObj.existingInventory;
          inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
          const inventoryTransaction = {};
          inventoryTransaction.batchNumber = productObj.batchNo;
          inventoryTransaction.costPrice = productObj.costPrice;
          inventoryTransaction.expiryDate = productObj.expiryDate;
          inventoryTransaction.quantity = productObj.qty;
          inventoryTransaction.availableQuantity = productObj.qty;
          inventory.transactions.push(inventoryTransaction);

          existingInventories.push(inventory);
        }
      });
      const awaitedPurchaseEntriesService = purchaseEntriesService.patch(purchaseEntry._id, purchaseEntry).then(payload => {
        awaitedPurchaseEntriesService.products.forEach((pl, ip) => {
          inventories.forEach((itemi, i) => {
            itemi.transactions.forEach((itemt, t) => {
              itemt.purchaseEntryId = awaitedPurchaseEntriesService._id;
              itemt.purchaseEntryDetailId = pl._id;
            });
          });

          existingInventories.forEach((itemi, i) => {
            if (itemi.transactions.length > 0) {
              const transactionLength = itemi.transactions.length;
              const index = transactionLength - 1;
              const lastTransaction = itemi.transactions[index];
              lastTransaction.purchaseEntryId = awaitedPurchaseEntriesService._id;
              lastTransaction.purchaseEntryDetailId = pl._id;
            }
          });
        });
        if (inventories.length > 0) {
          const awaitedInventory = inventoriesService.create(inventories);
        }
        if (existingInventories.length > 0) {
          existingInventories.forEach((ivn, iv) => {
            this.inventoryService.patch(ivn._id, ivn, {});
          });
        }
      });
      jsend.success(awaitedPurchaseEntriesService);
    } else {
      const purchaseEntry = {};
      purchaseEntry.invoiceAmount = data.amount.toString();
      purchaseEntry.deliveryDate = data.deliveryDate;
      purchaseEntry.facilityId = data.facilityId;
      purchaseEntry.invoiceNumber = data.invoiceNo;
      purchaseEntry.orderId = data.orderId;
      purchaseEntry.remark = data.desc;
      purchaseEntry.storeId = data.store;
      purchaseEntry.supplierId = data.supplier;
      purchaseEntry.createdBy = data.createdBy;

      purchaseEntry.products = [];
      
      /* end*/

      let inventories = [];
      let existingInventories = [];
      data.productForms.forEach((item, i) => {
        let productObj = item;
        let product = {};
        product.batchNo = productObj.batchNo;
        product.costPrice = productObj.costPrice;
        product.expiryDate = productObj.expiryDate;
        product.productId = productObj.id;
        product.quantity = productObj.qty;
        product.availableQuantity = productObj.qty;
        purchaseEntry.products.push(product);
        // if (productObj.existingInventory !== undefined) {
        //   console.log("*************************************************************************Am here*************************************************************************");
        //   const inventory = {};
        //   inventory.facilityId = data.facilityId;
        //   inventory.storeId = data.store;
        //   inventory.serviceId = productObj.existingInventory.serviceId;
        //   inventory.categoryId = productObj.existingInventory.categoryId;
        //   inventory.facilityServiceId = productObj.existingInventory.facilityServiceId;
        //   inventory.productId = productObj.existingInventory.productId;
        //   inventory.totalQuantity = productObj.qty;
        //   inventory.availableQuantity = productObj.qty;
        //   inventory.reorderLevel = 0;
        //   inventory.reorderQty = 0;
        //   inventory.transactions = [];


        //   const inventoryTransaction = {};
        //   inventoryTransaction.batchNumber = productObj.batchNo;
        //   inventoryTransaction.costPrice = productObj.costPrice;
        //   inventoryTransaction.expiryDate = productObj.expiryDate;
        //   inventoryTransaction.quantity = productObj.qty;
        //   inventoryTransaction.availableQuantity = productObj.qty;
        //   inventory.transactions.push(inventoryTransaction);

        //   inventories.push(inventory);
        //   console.log(inventories);
        // } else {
        //   if (productObj.existingInventory !== undefined) {
        //     delete productObj.existingInventory.productObject;
        //   }

        //   const inventory = productObj.existingInventory;
        //   inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
        //   inventory.availableQuantity = inventory.availableQuantity + productObj.qty;
        //   const inventoryTransaction = {};
        //   inventoryTransaction.batchNumber = productObj.batchNo;
        //   inventoryTransaction.costPrice = productObj.costPrice;
        //   inventoryTransaction.expiryDate = productObj.expiryDate;
        //   inventoryTransaction.quantity = productObj.qty;
        //   inventoryTransaction.availableQuantity = productObj.qty;
        //   inventory.transactions.push(inventoryTransaction);

        //   existingInventories.push(inventory);
        // }
        if (productObj.existingInventory !== undefined) {
          delete productObj.existingInventory.productObject;
        }

        const inventory = productObj.existingInventory;
        inventory.totalQuantity = inventory.totalQuantity + productObj.qty;
        inventory.availableQuantity = inventory.availableQuantity + productObj.qty;
        const inventoryTransaction = {};
        inventoryTransaction.batchNumber = productObj.batchNo;
        inventoryTransaction.costPrice = productObj.costPrice;
        inventoryTransaction.expiryDate = productObj.expiryDate;
        inventoryTransaction.quantity = productObj.qty;
        inventoryTransaction.availableQuantity = productObj.qty;
        inventory.transactions.push(inventoryTransaction);

        existingInventories.push(inventory);
      });
      
      const data_ = {
        purchaseEntry: purchaseEntry,
        orderId: data.orderId,
        inventories: inventories,
        existingInventories: existingInventories
      }
      const _makePurchaseEntriesService = await makePurchaseEntriesService.create(data_);
      return jsend.success(_makePurchaseEntriesService);
    }
    // 
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
