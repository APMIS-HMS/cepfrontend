// Initializes the `workbenches` service on path `/workbenches`
const createService = require('feathers-mongoose');
const createModel = require('../../models/workbenches.model');
const hooks = require('./workbenches.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'workbenches',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workbenches', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('workbenches');

  service.hooks(hooks);
};
