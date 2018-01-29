// Initializes the `makePayments` service on path `/make-payments`
const createService = require('./make-payments.class.js');
const hooks = require('./make-payments.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'make-payments',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/make-payments', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('make-payments');

  service.hooks(hooks);
};
