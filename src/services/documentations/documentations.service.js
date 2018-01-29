// Initializes the `documentations` service on path `/documentations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/documentations.model');
const hooks = require('./documentations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'documentations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/documentations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('documentations');

  service.hooks(hooks);
};
