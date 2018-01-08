// Initializes the `producttype` service on path `/producttype`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-types.model');
const hooks = require('./product-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-types');

  service.hooks(hooks);
};
