// Initializes the `formscopelevels` service on path `/formscopelevels`
const createService = require('feathers-mongoose');
const createModel = require('../../models/formscopelevels.model');
const hooks = require('./formscopelevels.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'formscopelevels',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/formscopelevels', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('formscopelevels');

  service.hooks(hooks);
};
