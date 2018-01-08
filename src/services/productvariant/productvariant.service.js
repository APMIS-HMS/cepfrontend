// Initializes the `productvariant` service on path `/productvariant`
const createService = require('feathers-mongoose');
const createModel = require('../../models/productvariant.model');
const hooks = require('./productvariant.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'productvariant',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/productvariant', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('productvariant');

  service.hooks(hooks);
};
