const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    inventory: () => async (inv, context) => {
      const inventoryTransferTransactionsLen = inv.inventoryTransferTransactions.length;
      for (let i = 0; i < inventoryTransferTransactionsLen; i++) {
        if (inv.inventoryTransferTransactions[i].transferStatusId !== null && inv.inventoryTransferTransactions[i].transferStatusId !== undefined) {
          const inve = await context.app
            .service('inventory-transfer-statuses')
            .get(inv.inventoryTransferTransactions[i].transferStatusId, {});
          inv.inventoryTransferTransactions[i].transferStatusObject = inve;
          const fpService = await context.app.service('formulary-products').get(inv.inventoryTransferTransactions[i].productId,{});
          if (fpService.data.id !== undefined) {
            inv.inventoryTransferTransactions[i].productObject = fpService;
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
        const getEmployee = await context.app.service('employees').get(data.transferBy);
        data.employeeObject = getEmployee;
      } catch (e) {
        // console.log(e);
      }
    }
  }
};

module.exports = {
  before: {
    all: [authenticate('jwt')],
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
