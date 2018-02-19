// Initializes the `stock-transfers` service on path `/stock-transfers`
const createService = require('./stock-transfers.class.js');
const hooks = require('./stock-transfers.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'stock-transfers',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/stock-transfers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stock-transfers');

  service.hooks(hooks);
};
