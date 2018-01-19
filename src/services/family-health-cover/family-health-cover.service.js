// Initializes the `familyHealthCover` service on path `/family-health-covered`
const createService = require('feathers-mongoose');
const createModel = require('../../models/family-health-cover.model');
const hooks = require('./family-health-cover.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'family-health-cover',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/family-health-covered', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('family-health-covered');

  service.hooks(hooks);
};
