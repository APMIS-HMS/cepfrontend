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
    let inventoryTransfers = await transferService.patch(id, data);
    let inventory = {};
    let batchDetail = {};
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
                      batchDetail = inventory.transactions[index2];
                    }
                  }
                }
              }
            }
            let updatedInv = await inventoriesService.patch(inventory._id, {
              totalQuantity: inventory.availableQuantity,
              transactions: inventory.transactions
            });

            let inventory2 = await inventoriesService.find({
              query: {
                facilityId: updatedInv.facilityId,
                productId: inventoryTransfers.inventoryTransferTransactions[index].productId,
                storeId: inventoryTransfers.destinationId
              }
            });
            if (inventory2.data.length > 0) {
              let batchTxn = inventory2.data[0].transactions.filter(x => x._id.toString() === inventoryTransfers.inventoryTransferTransactions[index].transactionId);
              if (batchTxn.length > 0) {
                let transaction = {
                  batchNumber: batchDetail.batchNumber,
                  employeeId: inventoryTransfers.transferBy,
                  preQuantity: batchTxn[0].quantity, // Before Operation.
                  postQuantity: inventoryTransfers.inventoryTransferTransactions[index].quantity, // After Operation.
                  quantity: batchTxn[0].availableQuantity, // Operational qty.
                  inventorytransactionTypeId: inventoryTransfers.inventorytransactionTypeId
                }
                batchTxn[0].availableQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                batchTxn[0].availableQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                inventory2.data[0].quantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                inventory2.data[0].availableQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
              }
              await inventoriesService.patch(inventory2.data[0]._id, inventory2.data[0]);

            } else {
              let inventoryModel = {};
              inventoryModel.facilityId = updatedInv.facilityId;
              inventoryModel.storeId = updatedInv.storeId;
              inventoryModel.serviceId = updatedInv.serviceId;
              inventoryModel.categoryId = updatedInv.categoryId;
              inventoryModel.facilityServiceId = updatedInv.facilityServiceId;
              inventoryModel.productId = updatedInv.productId;
              inventoryModel.transactions = [];
              inventoryModel.totalQuantity = inventoryTransfers.inventoryTransferTransactions[index].quantity;
              inventoryModel.availableQuantity = inventoryTransfers.inventoryTransferTransactions[index].quantity;

              inventoryModel.transactions.push(batchDetail);
              await inventoriesService.create(inventoryModel);
            }
          }

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
