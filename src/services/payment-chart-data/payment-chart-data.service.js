// Initializes the `payment-chart-data` service on path `/payment-chart-data`
const createService = require('./payment-chart-data.class.js');
const hooks = require('./payment-chart-data.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'payment-chart-data',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/payment-chart-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('payment-chart-data');

  service.hooks(hooks);
};
