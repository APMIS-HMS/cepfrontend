// Initializes the `facilityPrices` service on path `/facility-prices`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-prices.model');
const hooks = require('./facility-prices.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'facility-prices',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/facility-prices', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('facility-prices');

  service.hooks(hooks);
};
