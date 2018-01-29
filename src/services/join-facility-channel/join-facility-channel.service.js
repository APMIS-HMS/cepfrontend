// Initializes the `join-facility-channel` service on path `/join-facility-channel`
const createService = require('./join-facility-channel.class.js');
const hooks = require('./join-facility-channel.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'join-facility-channel',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/join-facility-channel', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('join-facility-channel');

  service.hooks(hooks);
};
