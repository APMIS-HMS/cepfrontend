// Initializes the `getTokens` service on path `/get-tokens`
const createService = require('./get-tokens.class.js');
const hooks = require('./get-tokens.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'get-tokens',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/get-tokens', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('get-tokens');

  service.hooks(hooks);
};
