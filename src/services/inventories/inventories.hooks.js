const { authenticate } = require('@feathersjs/authentication').hooks;

const {fastJoin} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productObject: () => async (data, context) => {
      try {
        console.log(data);
        console.log(data.productId.toString());
        const getProduct = await context.app.service('formulary-products').get(data.productId,{});
        console.log(getProduct);
        if(getProduct.data.id !== undefined){
          const productConfig = await context.app.service('product-configs').find({
            query: {
              facilityId: data.facilityId,
              productId: getProduct.data.id
            }
          });
          console.log("Am here");
          console.log(productConfig.data[0].packSizes);
          console.log(getProduct);
          getProduct.data.productConfigObject = productConfig.data[0].packSizes;
          data.productObject = getProduct.data;
          console.log(data);
        }
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
