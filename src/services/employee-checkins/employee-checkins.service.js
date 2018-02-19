// Initializes the `employee-checkins` service on path `/employee-checkins`
const createService = require('./employee-checkins.class.js');
const hooks = require('./employee-checkins.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'employee-checkins',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/employee-checkins', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('employee-checkins');

  service.hooks(hooks);
};
