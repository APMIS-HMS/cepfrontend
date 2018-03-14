// Initializes the `manufacturers` service on path `/manufacturers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/manufacturers.model');
const hooks = require('./manufacturers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'manufacturers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/manufacturers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('manufacturers');

  service.hooks(hooks);
};
