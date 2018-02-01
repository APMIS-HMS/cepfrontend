// Initializes the `customFacilityModules` service on path `/custom-facility-modules`
const createService = require('./custom-facility-modules.class.js');
const hooks = require('./custom-facility-modules.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'custom-facility-modules',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/custom-facility-modules', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('custom-facility-modules');

  service.hooks(hooks);
};
