// Initializes the `drugStrength` service on path `/drug-strength`
const createService = require('feathers-mongoose');
const createModel = require('../../models/drug-strength.model');
const hooks = require('./drug-strength.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'drug-strength',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/drug-strength', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('drug-strength');

  service.hooks(hooks);
};
