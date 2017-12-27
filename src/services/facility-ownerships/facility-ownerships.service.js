// Initializes the `facilityOwnerships` service on path `/facility-ownerships`
const createService = require('feathers-mongodb');
const hooks = require('./facility-ownerships.hooks');

module.exports = function (app) {
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/facility-ownerships', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-ownerships');

  mongoClient.then(db => {
    service.Model = db.collection('facility-ownerships');
  });

  service.hooks(hooks);
};
