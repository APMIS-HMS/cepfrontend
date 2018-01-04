// Initializes the `laboratoryRequests` service on path `/laboratory-requests`
const createService = require('feathers-mongoose');
const createModel = require('../../models/laboratory-requests.model');
const hooks = require('./laboratory-requests.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'laboratory-requests',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/laboratory-requests', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('laboratory-requests');

  service.hooks(hooks);
};
