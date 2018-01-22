// Initializes the `addNetworks` service on path `/add-networks`
const createService = require('./add-networks.class.js');
const hooks = require('./add-networks.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'add-networks',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/add-networks', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('add-networks');

  service.hooks(hooks);
};
