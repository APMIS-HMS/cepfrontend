const { authenticate } = require('@feathersjs/authentication').hooks;

const purchaseOrderId = require('../../hooks/purchase-order-id');
const { fastJoin } = require('feathers-hooks-common');
const resolvers = {
    joins: {
        facilityDetails: () => async(data, context) => {
          const facility = await context.app.service('facilities').find({
            query: {
              _id: data.supplierId
            }
          });
          data.supplierObject = facility;
        }
    }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [purchaseOrderId()],
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
