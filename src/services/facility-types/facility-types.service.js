// Initializes the `facilityTypes` service on path `/facility-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-types.model');
const hooks = require('./facility-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-types');

  service.hooks(hooks);
};
