/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const suppliersService = this.app.service('suppliers');
    const productsService = this.app.service('products');
    const orderService = this.app.service('purchase-orders');
    let supplier = await suppliersService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    let orders = await orderService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    if (orders != null) {
      if (orders.data.length > 0) {
        let len = orders.data.length - 1;
        for (let i = 0; i <= len; i++) {
          let index = supplier.data.filter(x => x._id.toString() === orders.data[i].supplierId.toString());
          if (index.length > 0) {
            orders.data[i].supplierObject = index[0];
          }
          if (orders.data[i].orderedProducts !== null || orders.data[i].orderedProducts !== undefined) {
            if (orders.data[i].orderedProducts.length > 0) {
              let len2 = orders.data[i].orderedProducts.length - 1;
              for (let j = 0; j <= len2; j++) {
                let getProduct = await productsService.get(orders.data[i].orderedProducts[j].productId);
                orders.data[i].orderedProducts[j].productObject = getProduct;
              }
            }
          }

        }
        return orders;
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  async get(id, params) {
    const suppliersService = this.app.service('suppliers');
    const productsService = this.app.service('products');
    const orderService = this.app.service('purchase-orders');
    let supplier = await suppliersService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    let orders = await orderService.get(id);
    if (orders !== null) {
      let index = supplier.data.filter(x => x._id.toString() === orders.supplierId.toString());
      if (index.length > 0) {
        orders.supplierObject = index[0];
      }
      if (orders.orderedProducts !== null || orders.orderedProducts !== undefined) {
        if (orders.orderedProducts.length > 0) {
          let len2 = orders.orderedProducts.length - 1;
          for (let j = 0; j <= len2; j++) {
            let getProduct = await productsService.get(orders.orderedProducts[j].productId);
            orders.orderedProducts[j].productObject = getProduct;
          }
        }
      }
      return orders;
    } else {
      return {};
    }
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
