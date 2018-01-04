// Initializes the `vitaLocations` service on path `/vita-locations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/vita-locations.model');
const hooks = require('./vita-locations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vita-locations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vita-locations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vita-locations');

  service.hooks(hooks);
};
