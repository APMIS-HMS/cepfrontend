// Initializes the `emailers` service on path `/emailers`
const createService = require('./emailers.class.js');
const hooks = require('./emailers.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'emailers',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/emailers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('emailers');

  service.hooks(hooks);
};
