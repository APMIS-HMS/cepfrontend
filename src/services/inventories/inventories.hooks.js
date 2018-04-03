const { authenticate } = require('@feathersjs/authentication').hooks;

const {fastJoin} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productObject: () => async (data, context) => {
      try {
        const getProduct = await context.app.service('products').get(data.productId);
        const productConfig = await context.app.service('product-configs').find({
          query: {
            facilityId: getProduct.facilityId,
            productId: getProduct._id
          }
        });
        getProduct.productConfigObject = productConfig.data[0].packSizes;
        data.productObject = getProduct;
      } catch (e) {
        // console.log(e);
      }
    }
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
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
