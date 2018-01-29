// Initializes the `join-network` service on path `/join-network`
const createService = require('./join-network.class.js');
const hooks = require('./join-network.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'join-network',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/join-network', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('join-network');

  service.hooks(hooks);
};
