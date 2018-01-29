// Initializes the `workspaces` service on path `/workspaces`
const createService = require('feathers-mongoose');
const createModel = require('../../models/workspaces.model');
const hooks = require('./workspaces.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'workspaces',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workspaces', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workspaces');

  service.hooks(hooks);
};
