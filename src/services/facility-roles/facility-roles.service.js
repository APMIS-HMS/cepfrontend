// Initializes the `facility-roles` service on path `/facility-roles`
const createService = require('./facility-roles.class.js');
const hooks = require('./facility-roles.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-roles',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/facility-roles', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-roles');

  service.hooks(hooks);
};
