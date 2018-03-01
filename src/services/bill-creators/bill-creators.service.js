// Initializes the `bill-creators` service on path `/bill-creators`
const createService = require('./bill-creators.class.js');
const hooks = require('./bill-creators.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bill-creators',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/bill-creators', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bill-creators');

  service.hooks(hooks);
};
