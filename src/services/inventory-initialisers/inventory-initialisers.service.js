// Initializes the `inventory-initialisers` service on path `/inventory-initialisers`
const createService = require('./inventory-initialisers.class.js');
const hooks = require('./inventory-initialisers.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'inventory-initialisers',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/inventory-initialisers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inventory-initialisers');

  service.hooks(hooks);
};
