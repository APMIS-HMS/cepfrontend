// Initializes the `corperateFacility` service on path `/corperate-facilities`
const createService = require('feathers-mongoose');
const createModel = require('../../models/corperate-facility.model');
const hooks = require('./corperate-facility.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'corperate-facility',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/corperate-facilities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('corperate-facilities');

  service.hooks(hooks);
};
