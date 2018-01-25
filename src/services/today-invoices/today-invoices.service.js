// Initializes the `todayInvoices` service on path `/today-invoices`
const createService = require('./today-invoices.class.js');
const hooks = require('./today-invoices.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'today-invoices',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/today-invoices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('today-invoices');

  service.hooks(hooks);
};
