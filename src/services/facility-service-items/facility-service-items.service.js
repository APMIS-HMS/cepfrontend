// Initializes the `facilityServiceItems` service on path `/facility-service-items`
const createService = require('./facility-service-items.class.js');
const hooks = require('./facility-service-items.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-service-items',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/facility-service-items', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-service-items');

  service.hooks(hooks);
};
