// Initializes the `inventories` service on path `/inventories`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inventories.model');
const hooks = require('./inventories.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inventories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventories');

  service.hooks(hooks);
};
