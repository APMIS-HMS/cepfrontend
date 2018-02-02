// Initializes the `save-appointment` service on path `/save-appointment`
const createService = require('./save-appointment.class.js');
const hooks = require('./save-appointment.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'save-appointment',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/save-appointment', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('save-appointment');

  service.hooks(hooks);
};
