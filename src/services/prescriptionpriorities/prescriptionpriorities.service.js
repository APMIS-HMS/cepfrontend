// Initializes the `prescriptionpriorities` service on path `/prescriptionpriorities`
const createService = require('feathers-mongoose');
const createModel = require('../../models/prescriptionpriorities.model');
const hooks = require('./prescriptionpriorities.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'prescriptionpriorities',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/prescriptionpriorities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prescriptionpriorities');

  service.hooks(hooks);
};
