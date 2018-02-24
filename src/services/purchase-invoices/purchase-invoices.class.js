/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const purchaseService = this.app.service('purchase-entries');
    const productsService = this.app.service('products');
    const purchase = await purchaseService.find({
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId,
        $limit: 100
      }
    });

    if (purchase.data !== undefined) {
      if (purchase.data.length > 0) {
        let len = purchase.data.length - 1;
        for (let index = 0; index <= len; index++) {
          if (purchase.data[index].products !== undefined) {
            if (purchase.data[index].products.length > 0) {
              let len2 = purchase.data[index].products.length - 1;
              for (let index2 = 0; index2 <= len2; index2++) {
                purchase.data[index].products[index2].productObject = await productsService.get(purchase.data[index].products[index2].productId);
              }
            }
          }
        }
      }
    }
    return purchase;
  }

  async get(id, params) {
    const purchaseService = this.app.service('purchase-entries');
    const supplierService = this.app.service('suppliers');
    const purchases = await purchaseService.find({
      query: {
        supplierId: params.query.supplierId,
        facilityId: params.query.facilityId
      }
    });
    const supplier = await supplierService.get(params.query.supplierId);
    purchases.supplier = supplier;
    return purchases;
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
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
