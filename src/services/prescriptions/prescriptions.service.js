// Initializes the `prescription` service on path `/prescription`
const createService = require('feathers-mongoose');
const createModel = require('../../models/prescriptions.model');
const hooks = require('./prescriptions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'prescriptions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/prescriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prescriptions');

  service.hooks(hooks);
};
