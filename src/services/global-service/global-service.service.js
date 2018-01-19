// Initializes the `globalService` service on path `/global-services`
const createService = require('feathers-mongoose');
const createModel = require('../../models/global-service.model');
const hooks = require('./global-service.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'global-service',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/global-services', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('global-services');

  service.hooks(hooks);
};
