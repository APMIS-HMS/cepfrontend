// Initializes the `dispense` service on path `/dispenses`
const createService = require('feathers-mongoose');
const createModel = require('../../models/dispense.model');
const hooks = require('./dispense.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'dispense',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/dispenses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('dispenses');

  service.hooks(hooks);
};
