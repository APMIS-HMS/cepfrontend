// Initializes the `bedTypes` service on path `/bed-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/bed-types.model');
const hooks = require('./bed-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bed-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bed-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bed-types');

  service.hooks(hooks);
};
