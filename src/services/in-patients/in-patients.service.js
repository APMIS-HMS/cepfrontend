// Initializes the `inPatients` service on path `/in-patients`
const createService = require('feathers-mongoose');
const createModel = require('../../models/in-patients.model');
const hooks = require('./in-patients.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'in-patients',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/in-patients', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('in-patients');

  service.hooks(hooks);
};
