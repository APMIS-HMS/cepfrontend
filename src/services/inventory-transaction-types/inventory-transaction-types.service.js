// Initializes the `inventoryTransactionTypes` service on path `/inventory-transaction-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inventory-transaction-types.model');
const hooks = require('./inventory-transaction-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inventory-transaction-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory-transaction-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory-transaction-types');

  service.hooks(hooks);
};
