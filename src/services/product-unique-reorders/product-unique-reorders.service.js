// Initializes the `product-unique-reorders` service on path `/product-unique-reorders`
const createService = require('./product-unique-reorders.class.js');
const hooks = require('./product-unique-reorders.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'product-unique-reorders',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/product-unique-reorders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-unique-reorders');

  service.hooks(hooks);
};
