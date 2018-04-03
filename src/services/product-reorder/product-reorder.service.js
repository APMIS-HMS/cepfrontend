// Initializes the `product-reorder` service on path `/product-reorders`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-reorder.model');
const hooks = require('./product-reorder.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-reorder',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-reorders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-reorders');

  service.hooks(hooks);
};
