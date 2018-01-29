// Initializes the `resend-token` service on path `/resend-token`
const createService = require('./resend-token.class.js');
const hooks = require('./resend-token.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'resend-token',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/resend-token', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('resend-token');

  service.hooks(hooks);
};
