// Initializes the `password-reset` service on path `/password-reset`
const createService = require('./password-reset.class.js');
const hooks = require('./password-reset.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'password-reset',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/password-reset', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('password-reset');

  service.hooks(hooks);
};
