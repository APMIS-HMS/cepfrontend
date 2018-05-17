// Initializes the `crud-immunization-service` service on path `/crud-immunization-service`
const createService = require('./crud-immunization-service.class.js');
const hooks = require('./crud-immunization-service.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'crud-immunization-service',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/crud-immunization-service', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('crud-immunization-service');

  service.hooks(hooks);
};
