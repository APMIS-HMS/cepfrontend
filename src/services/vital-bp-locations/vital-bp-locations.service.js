// Initializes the `vital-bp-locations` service on path `/vital-bp-locations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/vital-bp-locations.model');
const hooks = require('./vital-bp-locations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vital-bp-locations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vital-bp-locations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vital-bp-locations');

  service.hooks(hooks);
};
