// Initializes the `hmos` service on path `/hmos`
const createService = require('feathers-mongoose');
const createModel = require('../../models/hmos.model');
const hooks = require('./hmos.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'hmos',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/hmos', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('hmos');

  service.hooks(hooks);
};
