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
    const reqProductService = this.app.service('store-requisitions');
    const inventoryTransfersService = this.app.service('inventory-transfers');
    let inventoryTransfers = await inventoryTransfersService.create(data);
    let inventory = {};
    if (inventoryTransfers._id !== undefined) {
      if (inventoryTransfers.inventoryTransferTransactions !== undefined) {
        if (inventoryTransfers.inventoryTransferTransactions.length > 0) {
          let len = inventoryTransfers.inventoryTransferTransactions.length - 1;
          for (let index = len; index >= 0; index--) {
            inventory = await inventoriesService.get(inventoryTransfers.inventoryTransferTransactions[index].inventoryId);
            if (inventory._id !== undefined) {
              if (inventory.transactions !== undefined) {
                if (inventory.transactions.length > 0) {
                  let len2 = inventory.transactions.length - 1;
                  for (let index2 = len2; index2 >= 0; index2--) {
                    if (inventory.transactions[index2]._id.toString() === inventoryTransfers.inventoryTransferTransactions[index].transactionId.toString()) {
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
          if (data.requistionId !== null) {
            const requis = await reqProductService.patch(data.requistionId, {
              isSupplied: true
            });
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
                      batchDetail = inventory.transactions[index2];
                      const qty = inventory.transactions[index2].quantity;
                      let transaction = {
                        batchNumber: batchDetail.batchNumber,
                        employeeId: inventoryTransfers.transferBy,
                        preQuantity: qty, // Before Operation.
                        postQuantity: (inventory.totalQuantity - inventoryTransfers.inventoryTransferTransactions[index].quantity), // After Operation.
                        quantity: (inventory.totalQuantity - inventoryTransfers.inventoryTransferTransactions[index].quantity), // Operational qty.
                        inventorytransactionTypeId: inventoryTransfers.inventorytransactionTypeId
                      }
                      inventory.transactions[index2].batchTransactions.push(transaction);
                      inventory.transactions[index2].quantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;
                      inventory.totalQuantity -= inventoryTransfers.inventoryTransferTransactions[index].quantity;

                      let updatedInv = await inventoriesService.patch(inventory._id, inventory);

                      let inventory2 = await inventoriesService.find({
                        query: {
                          facilityId: updatedInv.facilityId,
                          productId: inventoryTransfers.inventoryTransferTransactions[index].productId,
                          storeId: inventoryTransfers.destinationStoreId
                        }
                      });
                      if (inventory2.data.length > 0) {
                        let batchTxn = inventory2.data[0].transactions.filter(x => x._id.toString() === inventoryTransfers.inventoryTransferTransactions[index].transactionId.toString());
                        if (batchTxn.length > 0) {
                          const qty2 = batchTxn[0].quantity;
                          let transaction = {
                            batchNumber: batchDetail.batchNumber,
                            employeeId: inventoryTransfers.transferBy,
                            preQuantity: qty2, // Before Operation.
                            postQuantity: (qty2 + inventoryTransfers.inventoryTransferTransactions[index].quantity), // After Operation.
                            quantity: (qty2 + inventoryTransfers.inventoryTransferTransactions[index].quantity), // Operational qty.
                            inventorytransactionTypeId: inventoryTransfers.inventorytransactionTypeId
                          }
                          batchTxn[0].quantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                          batchTxn[0].availableQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                          inventory2.data[0].totalQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                          inventory2.data[0].availableQuantity += inventoryTransfers.inventoryTransferTransactions[index].quantity;
                          if (inventory2.data[0].batchTransactions == undefined) {
                            inventory2.data[0].batchTransactions = [];
                          }
                          batchTxn[0].batchTransactions.push(transaction);
                        }
                        await inventoriesService.patch(inventory2.data[0]._id, inventory2.data[0]);

                      } else {
                        const inventoryModel = {
                          facilityId: updatedInv.facilityId,
                          storeId: inventoryTransfers.destinationStoreId,
                          serviceId: updatedInv.serviceId,
                          categoryId: updatedInv.categoryId,
                          facilityServiceId: updatedInv.facilityServiceId,
                          productId: updatedInv.productId,
                          transactions: [],
                          totalQuantity: inventoryTransfers.inventoryTransferTransactions[index].quantity,
                          availableQuantity: inventoryTransfers.inventoryTransferTransactions[index].quantity
                        };

                        batchDetail.quantity = inventoryTransfers.inventoryTransferTransactions[index].quantity;
                        batchDetail.availableQuantity = inventoryTransfers.inventoryTransferTransactions[index].quantity;
                        batchDetail.batchTransactions = [];
                        inventoryModel.transactions.push(batchDetail);
                        await inventoriesService.create(inventoryModel);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return inventoryTransfers;
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
