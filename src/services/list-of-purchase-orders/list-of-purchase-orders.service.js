// Initializes the `list-of-purchase-orders` service on path `/list-of-purchase-orders`
const createService = require('./list-of-purchase-orders.class.js');
const hooks = require('./list-of-purchase-orders.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-purchase-orders',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-purchase-orders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-purchase-orders');

  service.hooks(hooks);
};
