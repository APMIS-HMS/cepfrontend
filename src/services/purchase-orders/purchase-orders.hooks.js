const {
  authenticate
} = require('@feathersjs/authentication').hooks;

const purchaseOrderId = require('../../hooks/purchase-order-id');
const {
  fastJoin
} = require('feathers-hooks-common');
const resolvers = {
  joins: {
    facilityDetails: () => async (data, context) => {
      const facility = await context.app.service('facilities').find({
        query: {
          _id: data.supplierId
        }
      });
      data.supplierObject = facility;
    },
    productObject: () => async (data, context) => {
      if (data.orderedProducts !== null || data.orderedProducts !== undefined) {
        console.log(data.orderedProducts);
        if (data.orderedProducts.length > 0) {
          let len2 = data.orderedProducts.length - 1;
          for (let j = 0; j <= len2; j++) {
            if (data.orderedProducts[j] !== undefined) {
              try {
                let getProduct = await context.app.service('products').get(data.orderedProducts[j].productId);
                data.orderedProducts[j].productObject = getProduct;
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      }
    }
  }
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [purchaseOrderId()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
