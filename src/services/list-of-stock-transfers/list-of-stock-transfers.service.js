// Initializes the `list-of-stock-transfers` service on path `/list-of-stock-transfers`
const createService = require('./list-of-stock-transfers.class.js');
const hooks = require('./list-of-stock-transfers.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-stock-transfers',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-stock-transfers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-stock-transfers');

  service.hooks(hooks);
};
