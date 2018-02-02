// Initializes the `orderstatus` service on path `/order-status`
const createService = require('feathers-mongoose');
const createModel = require('../../models/orderstatus.model');
const hooks = require('./orderstatus.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'orderstatus',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/order-status', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('order-status');

  service.hooks(hooks);
};
