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
    const fpService = this.app.service('formulary-products');
    let products = {};
    products.data = [];
    let productIds = await fpService.find({
      query: {
        name: params.query.name
      }
    });
    for (let index = 0; index < productIds.data.length; index++) {
      let transferObject = {};
      if(params.query.isDestination === undefined){
        transferObject = await transferService.find({
          query: {
            facilityId: params.query.facilityId,
            storeId: params.query.storeId,
            'inventoryTransferTransactions.productId': productIds.data[index].id,
            $sort: {
              createdAt: -1
            }
          }
        });
      }else{
        transferObject = await transferService.find({
          query: {
            facilityId: params.query.facilityId,
            destinationStoreId: params.query.storeId,
            'inventoryTransferTransactions.productId': productIds.data[index].id,
            $sort: {
              createdAt: -1
            }
          }
        });
      }
      
      if (transferObject.data.length > 0) {
        transferObject.data.forEach(element => {
          products.data.push(element);
        });
       
      }

    }
    return products;
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
