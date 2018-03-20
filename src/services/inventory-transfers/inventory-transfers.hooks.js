const { authenticate } = require('@feathersjs/authentication').hooks;
const { fastJoin } = require('feathers-hooks-common');

const resolvers = {
  joins: {
      inventory: () => async(inv, context) => {
        const inventoryTransferTransactionsLen = inv.inventoryTransferTransactions.length;
        for(let i=0; i < inventoryTransferTransactionsLen; i++ ){
          if(inv.inventoryTransferTransactions[i].transferStatusId !== null && inv.inventoryTransferTransactions[i].transferStatusId !== undefined){
            const inve = await context.app
            .service('inventory-transfer-statuses')
            .get(inv.inventoryTransferTransactions[i].transferStatusId, {});
            inv.inventoryTransferTransactions[i].transferStatusObject = inve;
          }
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
