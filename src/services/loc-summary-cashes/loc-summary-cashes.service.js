// Initializes the `locSummaryCashes` service on path `/loc-summary-cashes`
const createService = require('./loc-summary-cashes.class.js');
const hooks = require('./loc-summary-cashes.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'loc-summary-cashes',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/loc-summary-cashes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('loc-summary-cashes');

  service.hooks(hooks);
};
