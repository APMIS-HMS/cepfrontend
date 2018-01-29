// Initializes the `genericName` service on path `/generic-names`
const createService = require('feathers-mongoose');
const createModel = require('../../models/generic-name.model');
const hooks = require('./generic-name.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'generic-name',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/generic-names', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('generic-names');

  service.hooks(hooks);
};
