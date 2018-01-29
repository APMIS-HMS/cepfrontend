// Initializes the `family-beneficiaries` service on path `/family-beneficiaries`
const createService = require('./family-beneficiaries.class.js');
const hooks = require('./family-beneficiaries.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'family-beneficiaries',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/family-beneficiaries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('family-beneficiaries');

  service.hooks(hooks);
};
