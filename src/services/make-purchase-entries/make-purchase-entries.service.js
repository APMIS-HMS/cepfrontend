// Initializes the `make-purchase-entries` service on path `/make-purchase-entries`
const createService = require('./make-purchase-entries.class.js');
const hooks = require('./make-purchase-entries.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'make-purchase-entries',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/make-purchase-entries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('make-purchase-entries');

  service.hooks(hooks);
};
