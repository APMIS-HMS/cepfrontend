// Initializes the `prescriptionpriorities` service on path `/prescriptionpriorities`
const createService = require('feathers-mongoose');
const createModel = require('../../models/prescription-priorities.model');
const hooks = require('./prescription-priorities.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'prescription-priorities',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/prescription-priorities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prescription-priorities');

  service.hooks(hooks);
};
