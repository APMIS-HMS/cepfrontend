// Initializes the `productvariant` service on path `/productvariant`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-variants.model');
const hooks = require('./product-variants.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'product-variants',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-variants', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('product-variants');

  service.hooks(hooks);
};
