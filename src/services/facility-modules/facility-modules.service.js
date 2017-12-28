// Initializes the `facility-modules` service on path `/facility-modules`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-modules.model');
const hooks = require('./facility-modules.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-modules',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-modules', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-modules');

  service.hooks(hooks);
};
