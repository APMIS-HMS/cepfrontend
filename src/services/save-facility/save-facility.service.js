// Initializes the `save-facility` service on path `/save-facility`
const createService = require('./save-facility.class.js');
const hooks = require('./save-facility.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'save-facility',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/save-facility', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('save-facility');

  service.hooks(hooks);
};
