// Initializes the `purchase-invoices` service on path `/purchase-invoices`
const createService = require('./purchase-invoices.class.js');
const hooks = require('./purchase-invoices.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'purchase-invoices',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/purchase-invoices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('purchase-invoices');

  service.hooks(hooks);
};
