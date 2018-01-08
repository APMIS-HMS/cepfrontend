// Initializes the `prescription` service on path `/prescription`
const createService = require('feathers-mongoose');
const createModel = require('../../models/prescription.model');
const hooks = require('./prescription.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'prescription',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/prescription', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prescription');

  service.hooks(hooks);
};
