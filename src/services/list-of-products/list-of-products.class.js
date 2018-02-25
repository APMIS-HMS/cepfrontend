/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    const productsService = this.app.service('products');
    const productTypesService = this.app.service('product-types');
    let findProductsService = {};
    if (params.query.name !== undefined) {
      findProductsService = await productsService.find({
        query: {
          name: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
    } else if (params.query.productTypeId !== undefined) {
      findProductsService = await productsService.find({
        query: {
          'productTypeId': params.query.productTypeId
        }
      });
    }
    return findProductsService;
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
