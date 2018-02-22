// Initializes the `drugStrengths` service on path `/drug-strengths`
const createService = require('feathers-mongoose');
const createModel = require('../../models/drug-strengths.model');
const hooks = require('./drug-strengths.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'drug-strengths',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/drug-strengths', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('drug-strengths');

  service.hooks(hooks);
};
