// Initializes the `schedule-types` service on path `/schedule-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/schedule-types.model');
const hooks = require('./schedule-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'schedule-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/schedule-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('schedule-types');

  service.hooks(hooks);
};
