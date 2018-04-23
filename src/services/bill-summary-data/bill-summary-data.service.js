// Initializes the `bill-summary-data` service on path `/bill-summary-data`
const createService = require('./bill-summary-data.class.js');
const hooks = require('./bill-summary-data.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bill-summary-data',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/bill-summary-data', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bill-summary-data');

  service.hooks(hooks);
};
