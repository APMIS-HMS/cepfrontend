// Initializes the `crud-lab-request` service on path `/crud-lab-request`
const createService = require('./crud-lab-request.class.js');
const hooks = require('./crud-lab-request.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'crud-lab-request',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/crud-lab-request', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('crud-lab-request');

  service.hooks(hooks);
};
