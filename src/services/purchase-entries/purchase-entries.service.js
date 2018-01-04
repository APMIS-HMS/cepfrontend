// Initializes the `purchaseEntries` service on path `/purchase-entries`
const createService = require('feathers-mongoose');
const createModel = require('../../models/purchase-entries.model');
const hooks = require('./purchase-entries.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'purchase-entries',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/purchase-entries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('purchase-entries');

  service.hooks(hooks);
};
