// Initializes the `facility-roles` service on path `/facility-roles`
const createService = require('./facility-roles.class.js');
const hooks = require('./facility-roles.hooks');
const filters = require('./facility-roles.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-roles',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-roles', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-roles');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
