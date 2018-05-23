const { authenticate } = require('@feathersjs/authentication').hooks;
const requisitionId = require('../../hooks/requisition-id');

const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    product: () => async (data, context) => {
      const productLen = data.products.length;
      for (let i = 0; i < productLen; i++) {
        if (data.products[i].productId !== null && data.products[i].productId !== undefined) {
          const fpService = await context.app.service('formulary-products').get(data.products[i].productId,{});
          if (fpService.data.id !== undefined) {
            data.products[i].productObject = fpService;
          }
        }
      }
    },
    store: () => async (data, context) => {
      try {
        const getResidentStore = await context.app.service('stores').get(data.storeId);
        data.storeObject = getResidentStore;
      } catch (e) {
        // console.log(e);
      }
      try {
        const getDestinationStore = await context.app.service('stores').get(data.destinationStoreId);
        data.destinationStoreObject = getDestinationStore;
      } catch (e) {
        // console.log(e);
      }
    },
    employee: () => async (data, context) => {
      try {
        const getEmployee = await context.app.service('employees').get(data.employeeId);
        data.employeeObject = getEmployee;
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
    create: [requisitionId()],
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
