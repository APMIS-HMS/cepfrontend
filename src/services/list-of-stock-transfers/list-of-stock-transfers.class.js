/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const transferService = this.app.service('inventory-transfers');
    const storesService = this.app.service('stores');
    const employeesService = this.app.service('employees');
    const peopleService = this.app.service('people');
    const productsService = this.app.service('products');
    const inventoryService = this.app.service('inventories');
    let stocksOnTransfer = {};
    if (params.query.storeId !== undefined) {
      stocksOnTransfer = await transferService.find({
        query: {
          facilityId: params.query.facilityId,
          storeId: params.query.storeId,
          $limit: params.query.limit
        }
      });
    } else if (params.query.destinationStoreId !== undefined) {
      stocksOnTransfer = await transferService.find({
        query: {
          facilityId: params.query.facilityId,
          destinationStoreId: params.query.destinationStoreId,
          $limit: params.query.limit
        }
      });
    }
    if (stocksOnTransfer != null) {
      if (stocksOnTransfer.data != undefined) {
        if (stocksOnTransfer.data.length > 0) {
          let len = stocksOnTransfer.data.length - 1;
          for (let index = len; index >= 0; index--) {
            let storeD = await storesService.get(stocksOnTransfer.data[index].destinationStoreId);
            stocksOnTransfer.data[index].destinationStoreObject = storeD;

            let storeR = await storesService.get(stocksOnTransfer.data[index].storeId);
            stocksOnTransfer.data[index].storeObject = storeR;

            let employee = await employeesService.get(stocksOnTransfer.data[index].transferBy);
            let person = await peopleService.get(employee.personId);

            stocksOnTransfer.data[index].transferByObject = person;
            if (stocksOnTransfer.data[index].inventoryTransferTransactions !== null) {
              if (stocksOnTransfer.data[index].inventoryTransferTransactions.length > 0) {
                let len2 = stocksOnTransfer.data[index].inventoryTransferTransactions.length - 1;
                for (let index2 = len2; index2 >= 0; index2--) {
                  let inv = await inventoryService.get(stocksOnTransfer.data[index].inventoryTransferTransactions[index2].inventoryId, {});
                  let product = await productsService.get(stocksOnTransfer.data[index].inventoryTransferTransactions[index2].productId);
                  stocksOnTransfer.data[index].inventoryTransferTransactions[index2].productObject = product;
                  let tran = inv.transactions.filter(m => m._id.toString() == stocksOnTransfer.data[index].inventoryTransferTransactions[index2].transactionId.toString() );
                  stocksOnTransfer.data[index].inventoryTransferTransactions[index2].transactionObject = tran[0];
                }
              } else {
                return {};
              }
            } else {
              return {};
            }
          }
          return stocksOnTransfer;
        } else {
          return {};
        }
      } else {
        return {}
      }

    } else {
      return {};
    }
  }

  async get(id, params) {
    const transferService = this.app.service('inventory-transfers');
    const storesService = this.app.service('stores');
    const employeesService = this.app.service('employees');
    const peopleService = this.app.service('people');
    const productsService = this.app.service('products');
    let stocksOnTransfer = await transferService.get(id);
    if (stocksOnTransfer != null) {
      let storeD = await storesService.get(stocksOnTransfer.destinationStoreId);
      stocksOnTransfer.destinationStoreObject = storeD;

      let storeR = await storesService.get(stocksOnTransfer.storeId);
      stocksOnTransfer.storeObject = storeR;

      let employee = await employeesService.get(stocksOnTransfer.transferBy);
      let person = await peopleService.get(employee.personId);

      stocksOnTransfer.transferByObject = person;
      if (stocksOnTransfer.inventoryTransferTransactions != null) {
        if (stocksOnTransfer.inventoryTransferTransactions.length > 0) {
          let len = stocksOnTransfer.inventoryTransferTransactions.length - 1;
          for (let index = len; index >= 0; index--) {
            let product = await productsService.get(stocksOnTransfer.inventoryTransferTransactions[index].productId);
            stocksOnTransfer.inventoryTransferTransactions[index].productObject = product;
          }
          return stocksOnTransfer;
        } else {
          return {};
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  async create(data, params) {

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
