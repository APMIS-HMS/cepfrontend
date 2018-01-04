// Initializes the `inventoryTransfers` service on path `/inventory-transfers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inventory-transfers.model');
const hooks = require('./inventory-transfers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inventory-transfers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory-transfers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory-transfers');

  service.hooks(hooks);
};
