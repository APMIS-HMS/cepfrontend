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
    const inventoryTransfersService = this.app.service('inventory-transfers');
    let inventoryTransfers = await inventoryTransfersService.create(data);
    let inventory = {};
    if (inventoryTransfers != null) {
      if (inventoryTransfers.inventoryTransferTransactions != undefined) {
        if (inventoryTransfers.inventoryTransferTransactions.length > 0) {
          let len = inventoryTransfers.inventoryTransferTransactions.length - 1;
          for (let index = len; index >= 0; index--) {
            inventory = await inventoriesService.get(inventoryTransfers.inventoryTransferTransactions[index].inventoryId);
            if (inventory != null) {
              if (inventory.transactions != undefined) {
                if (inventory.transactions.length > 0) {
                  let len2 = inventory.transactions.length - 1;
                  for (let index2 = len2; index2 >= 0; index2--) {
                    if (inventory.transactions[index2]._id.toString() == inventoryTransfers.inventoryTransferTransactions[index].transactionId.toString()) {
                      inventory.transactions[index2].availableQuantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;
                      inventory.availableQuantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;
                    }
                  }
                }
              }
            }
          }
          let updatedInv = await inventoriesService.patch(inventory._id, {
            availableQuantity: inventory.availableQuantity,
            transactions: inventory.transactions
          });
          let result = {
            inventoryTransfers: inventoryTransfers,
            inventory: updatedInv
          };
          return result;
        } else {
          return {};
        }
      } else {
        return {};
      }
    }
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  async patch(id, data, params) {
    const transferService = this.app.service('inventory-transfers');
    const inventoriesService = this.app.service('inventories');
    let inventoryTransfers = await transferService.patch(id,data);
    let inventory = {};
    if (inventoryTransfers != null) {
      if (inventoryTransfers.inventoryTransferTransactions != undefined) {
        if (inventoryTransfers.inventoryTransferTransactions.length > 0) {
          let len = inventoryTransfers.inventoryTransferTransactions.length - 1;
          for (let index = len; index >= 0; index--) {
            inventory = await inventoriesService.get(inventoryTransfers.inventoryTransferTransactions[index].inventoryId);
            if (inventory != null) {
              if (inventory.transactions != undefined) {
                if (inventory.transactions.length > 0) {
                  let len2 = inventory.transactions.length - 1;
                  for (let index2 = len2; index2 >= 0; index2--) {
                    if (inventory.transactions[index2]._id.toString() == inventoryTransfers.inventoryTransferTransactions[index].transactionId.toString()) {
                      inventory.transactions[index2].quantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;
                      inventory.totalQuantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;
                    }
                  }
                }
              }
            }
          }
          let updatedInv = await inventoriesService.patch(inventory._id, {
            totalQuantity: inventory.availableQuantity,
            transactions: inventory.transactions
          });
          let result = {
            inventoryTransfers: inventoryTransfers,
            inventory: updatedInv
          };
          return result;
        } else {
          return {};
        }
      } else {
        return {};
      }
    }
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
