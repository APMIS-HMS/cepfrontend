// Initializes the `storeRequisitions` service on path `/store-requisitions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/store-requisitions.model');
const hooks = require('./store-requisitions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'store-requisitions',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/store-requisitions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('store-requisitions');

  service.hooks(hooks);
};
