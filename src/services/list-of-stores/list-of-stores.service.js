// Initializes the `list-of-stores` service on path `/list-of-stores`
const createService = require('./list-of-stores.class.js');
const hooks = require('./list-of-stores.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-stores',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-stores', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-stores');

  service.hooks(hooks);
};
