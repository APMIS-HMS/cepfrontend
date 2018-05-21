// Initializes the `add-purchase-entries` service on path `/add-purchase-entries`
const createService = require('./add-purchase-entries.class.js');
const hooks = require('./add-purchase-entries.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'add-purchase-entries',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/add-purchase-entries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('add-purchase-entries');

  service.hooks(hooks);
};
