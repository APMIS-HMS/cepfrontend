const {
  authenticate
} = require('@feathersjs/authentication').hooks;
const {
  fastJoin
} = require('feathers-hooks-common');

const resolvers = {
  joins: {
    supplierObject: () => async (entryItem, context) => {
      try {
        if (entryItem.supplierId !== undefined && entryItem.supplierId !== null) {
          const supplier = await context.app.service('suppliers').get(entryItem.supplierId, {});
          entryItem.supplierObject = supplier;
        }
      } catch (error) {
        entryItem.supplierObject = {};
      }
    },
    orderObject: () => async (entryItem, context) => {
      if (entryItem.orderId !== null && entryItem.supplierId !== undefined) {
        try {
          const purchase = await context.app.service('purchase-orders').get(entryItem.orderId, {});
          entryItem.orderObject = purchase;
        } catch (error) {
          entryItem.orderObject = {};
        }
      }
    },
    employeeObject: () => async (entryItem, context) => {
      if (entryItem.createdBy !== null && entryItem.createdBy !== undefined) {
        try {
          const employee = await context.app.service('employees').get(entryItem.createdBy, {});
          entryItem.employeeObject = employee;
        } catch (error) {
          entryItem.employeeObject = {};
        }
      }
    },
    productObject: () => async (entryItem, context) => {
      if (entryItem.products.length > 0) {
        const len = entryItem.products.length - 1;
        for (let index = 0; index <= len; index++) {
          if (entryItem.products[index].productId !== null && entryItem.products[index].productId !== undefined) {
            try {
              const product = await context.app.service('products').get(entryItem.products[index].productId, {});
              entryItem.products[index].productObject = product;
            } catch (error) {
              entryItem.products[index].productObject = {};
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
