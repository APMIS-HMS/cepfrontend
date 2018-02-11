// Initializes the `drug-details-apis` service on path `/drug-details-apis`
const createService = require('./drug-details-apis.class.js');
const hooks = require('./drug-details-apis.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'drug-details-apis',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/drug-details-apis', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('drug-details-apis');

  service.hooks(hooks);
};
