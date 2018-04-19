// Initializes the `db-patientids` service on path `/db-patientids`
const createService = require('./db-patientids.class.js');
const hooks = require('./db-patientids.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'db-patientids',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/db-patientids', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('db-patientids');

  service.hooks(hooks);
};
