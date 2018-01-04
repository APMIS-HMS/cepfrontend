// Initializes the `vitalPositions` service on path `/vital-positions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/vital-positions.model');
const hooks = require('./vital-positions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vital-positions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vital-positions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vital-positions');

  service.hooks(hooks);
};
