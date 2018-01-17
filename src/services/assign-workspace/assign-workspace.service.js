// Initializes the `assign-workspace` service on path `/assign-workspace`
const createService = require('./assign-workspace.class.js');
const hooks = require('./assign-workspace.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'assign-workspace',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/assign-workspace', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('assign-workspace');

  service.hooks(hooks);
};
