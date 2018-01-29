// Initializes the `facilityServiceRender` service on path `/facility-service-rendered`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-service-render.model');
const hooks = require('./facility-service-render.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-service-render',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-service-rendered', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-service-rendered');

  service.hooks(hooks);
};
