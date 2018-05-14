// Initializes the `immunization` service on path `/immunization`
const createService = require('feathers-mongoose');
const createModel = require('../../models/immunization.model');
const hooks = require('./immunization.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'immunization',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/immunization', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('immunization');

  service.hooks(hooks);
};
