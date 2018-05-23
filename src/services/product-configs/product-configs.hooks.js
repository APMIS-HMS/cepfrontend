const { authenticate } = require('@feathersjs/authentication').hooks;
const {fastJoin} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    productObject: () => async (data, context) => {
      try {
        const getProduct = await context.app.service('formulary-products').get(data.productId,{});
        data.productObject = getProduct.data;
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
