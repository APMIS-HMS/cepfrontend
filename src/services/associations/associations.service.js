// Initializes the `associations` service on path `/associations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/associations.model');
const hooks = require('./associations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'associations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/associations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('associations');

  service.hooks(hooks);
};
