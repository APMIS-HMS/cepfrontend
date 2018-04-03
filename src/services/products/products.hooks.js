const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productTypeObject: () => async (item, context) => {
      const productType = await context.app.service('product-types').get(item.productTypeId, {});
      item.productTypeObject = productType;
    },
    productConfigObject: () => async (item, context) => {
      if (context.facilityId !== undefined) {
        const productConfig = await context.app.service('product-configs').find({
          query: {
            facilityId: context.facilityId,
            productId: item._id
          }
        });
        if (productConfig.data.length > 0) {
          item.productConfigObject = productConfig.data[0].packSizes;
        }
      }
    }
  }
}


const getLoginFacilityId = require('../../hooks/get-login-facility-id');


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [getLoginFacilityId()],
    get: [getLoginFacilityId()],
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
