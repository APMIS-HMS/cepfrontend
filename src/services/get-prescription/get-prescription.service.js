// Initializes the `getPrescription` service on path `/get-prescription`
const createService = require('./get-prescription.class.js');
const hooks = require('./get-prescription.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'get-prescription',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/get-prescription', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('get-prescription');

  service.hooks(hooks);
};
