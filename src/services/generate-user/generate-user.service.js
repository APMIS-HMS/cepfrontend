// Initializes the `generate-user` service on path `/generate-user`
const createService = require('./generate-user.class.js');
const hooks = require('./generate-user.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'generate-user',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/generate-user', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('generate-user');

  service.hooks(hooks);
};
