/* eslint-disable no-unused-vars */
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
    const purchaseOrderService = this.app.service('purchase-orders');
    let _createInventory = {};
    let purchaseEntry = await purchaseEntriesService.create(data.purchaseEntry);
    if (purchaseEntry.products !== undefined) {
      if (purchaseEntry.products.length > 0) {
        let len = purchaseEntry.products.length - 1;
        for (let i = 0; i <= len; i++) {
          if (data.inventories !== undefined) {
            if (data.inventories.length > 0) {
              let len2 = data.inventories.length - 1;
              for (let j = 0; j <= len2; j++) {
                if (data.inventories[j].transactions !== undefined) {
                  if (data.inventories[j].transactions.length > 0) {
                    let len3 = data.inventories[j].transactions.length - 1;
                    for (let k = 0; k <= len3; k++) {
                      data.inventories[j].transactions[k].purchaseEntryId = purchaseEntry._id;
                      data.inventories[j].transactions[k].purchaseEntryDetailId = purchaseEntry.products[i]._id;
                    }
                  }
                }
              }
            }
          }
          if (data.existingInventories !== undefined) {
            if (data.existingInventories.length > 0) {
              let len4 = data.existingInventories.length - 1;
              for (let index = 0; index <= len4; index++) {

                if (data.existingInventories[index].transactions.length > 0) {
                  const transactionLength = data.existingInventories[index].transactions.length;
                  const indx = transactionLength - 1;
                  const lastTransaction = data.existingInventories[index].transactions[indx];
                  lastTransaction.purchaseEntryId = purchaseEntry._id;
                  lastTransaction.purchaseEntryDetailId = purchaseEntry.products[i]._id;
                }
              }
            }
          }
        }
      }
    }
    if (data.inventories.length > 0) {
      let createInventory = await inventoriesService.create(data.inventories, {});
      _createInventory = createInventory;
    }
    if (data.existingInventories !== undefined) {
      if (data.existingInventories.length > 0) {
        let len5 = data.existingInventories.length - 1
        for (let index2 = 0; index2 <= len5; index2++) {
          let createInventory = await inventoriesService.patch(data.existingInventories[index2]._id, data.existingInventories[index2], {});
          _createInventory = createInventory;
        }
      }
    }
    if (data.orderId !== undefined) {
      let updatePurchase = await purchaseOrderService.patch(data.orderId, {
        isSupplied: true
      });
    }
    return _createInventory;
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
