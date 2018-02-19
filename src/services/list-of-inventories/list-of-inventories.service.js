// Initializes the `list-of-inventories` service on path `/list-of-inventories`
const createService = require('./list-of-inventories.class.js');
const hooks = require('./list-of-inventories.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-inventories',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-inventories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-inventories');

  service.hooks(hooks);
};
