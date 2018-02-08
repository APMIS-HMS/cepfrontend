/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find (params) {
    console.log(params.query);
    const productsService = this.app.service('products');
    const productTypesService = this.app.service('product-types');
    let findProductsService = {};
    if(params.query.name != undefined){
      findProductsService = await productsService.find({
        query: {
          facilityId: params.query.facilityId,
          name: {
            $regex: params.query.name,
            '$options': 'i'
          }
        }
      });
    }else if(params.query.productTypeId != undefined){
      findProductsService = await productsService.find({
        query: {
          facilityId: params.query.facilityId,
          'productTypeId':params.query.productTypeId
        }
      });
    }else{}
    
    if (findProductsService.data.length > 0) {
      let len = findProductsService.data.length - 1;
      for (let j = len; j >= 0; j--) {
        let getProductType = await productTypesService.get(findProductsService.data[j].productTypeId);
        findProductsService.data[j].productType = getProductType;
      }
      return findProductsService;
    } else {
      return findProductsService;
    }
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
    return Promise.resolve({ id });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
