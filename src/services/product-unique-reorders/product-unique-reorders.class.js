/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const productService = this.app.service('formulary-products');
    const reorderService = this.app.service('product-reorders');
    var value = {};
    value.data = [];
    const products = await productService.find({
      query: {
        name: params.query.name
      }
    });
    const reorders = await reorderService.find({
      query: {
        facilityId: params.query.facilityId,
        storeId: params.query.storeId
      }
    });
    products.data.forEach(element => {
      const filter = reorders.data.filter(x => x.productId.toString() === element.id.toString());
      if (filter.length === 0) {
        value.data.push(element);
      }
    });

    return value;
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
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
