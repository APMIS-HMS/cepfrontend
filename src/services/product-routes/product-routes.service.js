// Initializes the `productroutes` service on path `/productroutes`
const createService = require('feathers-mongoose');
const createModel = require('../../models/productroutes.model');
const hooks = require('./productroutes.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'productroutes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/productroutes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('productroutes');

  service.hooks(hooks);
};
