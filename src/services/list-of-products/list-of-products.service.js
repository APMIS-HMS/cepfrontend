// Initializes the `list-of-products` service on path `/list-of-products`
const createService = require('./list-of-products.class.js');
const hooks = require('./list-of-products.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'list-of-products',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/list-of-products', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('list-of-products');

  service.hooks(hooks);
};
