// Initializes the `ward-setup` service on path `/ward-setup`
const createService = require('./ward-setup.class.js');
const hooks = require('./ward-setup.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'ward-setup',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ward-setup', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ward-setup');

  service.hooks(hooks);
};
