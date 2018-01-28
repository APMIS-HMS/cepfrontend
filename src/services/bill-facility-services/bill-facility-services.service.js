// Initializes the `billFacilityServices` service on path `/bill-facility-services`
const createService = require('./bill-facility-services.class.js');
const hooks = require('./bill-facility-services.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bill-facility-services',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/bill-facility-services', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bill-facility-services');

  service.hooks(hooks);
};
