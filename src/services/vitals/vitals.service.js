// Initializes the `vitals` service on path `/vitals`
const createService = require('./vitals.class.js');
const hooks = require('./vitals.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'vitals',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/vitals', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vitals');

  service.hooks(hooks);
};
