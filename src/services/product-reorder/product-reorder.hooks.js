const { authenticate } = require('@feathersjs/authentication').hooks;
const {fastJoin } = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productObject: () => async (item, context) => {
      try{
        const product = await context.app.service('formulary-products').get(item.productId, {});
        item.productObject = product;
      }catch(Exception){

      }
    },
    productItemConfigObject: () => async (item, context) => {
      try{
        const configItems = await context.app.service('product-configs').find({query:{facilityId:item.facilityId,productId:item.productId}});
        const packDetails = configItems.data[0].packSizes.find(x=>x._id.toString()===item.reOrderSizeId.toString());
        item.productItemConfigObject = packDetails;
        item.productConfigObject = configItems.data[0].packSizes;
      }catch(Exception){

      }
      
    }
  }
}

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
