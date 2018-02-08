// Initializes the `appointment-types` service on path `/appointment-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/appointment-types.model');
const hooks = require('./appointment-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'appointment-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/appointment-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('appointment-types');

  service.hooks(hooks);
};
