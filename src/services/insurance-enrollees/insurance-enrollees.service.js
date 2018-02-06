// Initializes the `insurance-enrollees` service on path `/insurance-enrollees`
const createService = require('./insurance-enrollees.class.js');
const hooks = require('./insurance-enrollees.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'insurance-enrollees',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/insurance-enrollees', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('insurance-enrollees');

  service.hooks(hooks);
};
