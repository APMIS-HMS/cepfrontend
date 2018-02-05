// Initializes the `family-dependants` service on path `/family-dependants`
const createService = require('./family-dependants.class.js');
const hooks = require('./family-dependants.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'family-dependants',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/family-dependants', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('family-dependants');

  service.hooks(hooks);
};
