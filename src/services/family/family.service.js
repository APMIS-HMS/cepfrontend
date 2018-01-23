// Initializes the `family` service on path `/families`
const createService = require('feathers-mongoose');
const createModel = require('../../models/family.model');
const hooks = require('./family.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'family',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/families', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('families');

  service.hooks(hooks);
};
