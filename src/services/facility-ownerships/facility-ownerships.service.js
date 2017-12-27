// Initializes the `facilityOwnerships` service on path `/facility-ownerships`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-ownerships.model');
const hooks = require('./facility-ownerships.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-ownerships',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-ownerships', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-ownerships');

  service.hooks(hooks);
};
