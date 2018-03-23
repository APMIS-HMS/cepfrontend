// Initializes the `product-configs` service on path `/product-configs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-configs.model');
const hooks = require('./product-configs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-configs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-configs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-configs');

  service.hooks(hooks);
};
