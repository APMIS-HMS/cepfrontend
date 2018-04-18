// Initializes the `list-of-invoices` service on path `/list-of-invoices`
const createService = require('./list-of-invoices.class.js');
const hooks = require('./list-of-invoices.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-invoices',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-invoices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-invoices');

  service.hooks(hooks);
};
