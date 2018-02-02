// Initializes the `billManagers` service on path `/bill-managers`
const createService = require('./bill-managers.class.js');
const hooks = require('./bill-managers.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bill-managers',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/bill-managers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bill-managers');

  service.hooks(hooks);
};
