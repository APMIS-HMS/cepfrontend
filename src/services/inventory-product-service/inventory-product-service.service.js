// Initializes the `inventory-product-service` service on path `/inventory-product-service`
const createService = require('./inventory-product-service.class.js');
const hooks = require('./inventory-product-service.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'inventory-product-service',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/inventory-product-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory-product-service');

  service.hooks(hooks);
};
