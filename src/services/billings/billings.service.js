// Initializes the `billings` service on path `/billings`
const createService = require('feathers-mongoose');
const createModel = require('../../models/billings.model');
const hooks = require('./billings.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'billings',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/billings', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('billings');

  service.hooks(hooks);
};
