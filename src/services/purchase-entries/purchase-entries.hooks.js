const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    supplierObject: () => async (entryItem, context) => {
      const supplier = await context.app.service('suppliers').get(entryItem.supplierId, {});
      entryItem.supplierObject = supplier;
    },
    orderObject: () => async (entryItem, context) => {
      if (entryItem.orderId !== null) {
        const purchase = await context.app.service('purchase-orders').get(entryItem.orderId, {});
        entryItem.orderObject = purchase;
      }
    },
    employeeObject: () => async (entryItem, context) => {
      const employee = await context.app.service('employees').get(entryItem.createdBy, {});
      entryItem.employeeObject = employee;
    },
    productObject: () => async (entryItem, context) => {
      if (entryItem.products.length > 0) {
        const len = entryItem.products.length - 1;
        for (let index = 0; index <= len; index++) {
          const product = await context.app.service('products').get(entryItem.products[index].productId, {});
          entryItem.products[index].productObject = product;
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
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [fastJoin(resolvers)],
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
