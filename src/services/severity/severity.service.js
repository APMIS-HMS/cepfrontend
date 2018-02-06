// Initializes the `severity` service on path `/severities`
const createService = require('feathers-mongoose');
const createModel = require('../../models/severity.model');
const hooks = require('./severity.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'severity',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/severities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('severities');

  service.hooks(hooks);
};
