// Initializes the `facilityClasses` service on path `/facility-classes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-classes.model');
const hooks = require('./facility-classes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-classes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-classes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-classes');

  service.hooks(hooks);
};
