// Initializes the `pendingBills` service on path `/pending-bills`
const createService = require('./pending-bills.class.js');
const hooks = require('./pending-bills.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'pending-bills',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/pending-bills', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('pending-bills');

  service.hooks(hooks);
};
