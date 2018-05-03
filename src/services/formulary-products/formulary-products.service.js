// Initializes the `formulary-products` service on path `/formulary-products`
const createService = require('./formulary-products.class.js');
const hooks = require('./formulary-products.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'formulary-products',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/formulary-products', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('formulary-products');

  service.hooks(hooks);
};
