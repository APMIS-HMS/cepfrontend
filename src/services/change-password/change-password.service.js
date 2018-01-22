// Initializes the `change-password` service on path `/change-password`
const createService = require('./change-password.class.js');
const hooks = require('./change-password.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'change-password',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/change-password', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('change-password');

  service.hooks(hooks);
};
