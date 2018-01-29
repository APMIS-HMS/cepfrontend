// Initializes the `productroutes` service on path `/productroutes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-routes.model');
const hooks = require('./product-routes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-routes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-routes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-routes');

  service.hooks(hooks);
};
