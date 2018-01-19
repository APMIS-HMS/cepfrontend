// Initializes the `frequency` service on path `/frequencies`
const createService = require('feathers-mongoose');
const createModel = require('../../models/frequency.model');
const hooks = require('./frequency.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'frequency',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/frequencies', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('frequencies');

  service.hooks(hooks);
};
