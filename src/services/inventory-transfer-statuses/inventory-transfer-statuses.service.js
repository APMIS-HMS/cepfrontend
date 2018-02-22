// Initializes the `inventory-transfer-statuses` service on path `/inventory-transfer-statuses`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inventory-transfer-statuses.model');
const hooks = require('./inventory-transfer-statuses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inventory-transfer-statuses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory-transfer-statuses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory-transfer-statuses');

  service.hooks(hooks);
};
