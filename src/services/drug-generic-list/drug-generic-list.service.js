// Initializes the `drugGenericList` service on path `/drug-generic-list`
const createService = require('./drug-generic-list.class.js');
const hooks = require('./drug-generic-list.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'drug-generic-list',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/drug-generic-list', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('drug-generic-list');

  service.hooks(hooks);
};
