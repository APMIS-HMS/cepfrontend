// Initializes the `symptoms` service on path `/symptoms`
const createService = require('feathers-mongoose');
const createModel = require('../../models/symptoms.model');
const hooks = require('./symptoms.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'symptoms',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/symptoms', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('symptoms');

  service.hooks(hooks);
};
