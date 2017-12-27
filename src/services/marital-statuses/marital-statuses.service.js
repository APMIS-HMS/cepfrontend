// Initializes the `maritalStatuses` service on path `/marital-statuses`
const createService = require('feathers-mongoose');
const createModel = require('../../models/marital-statuses.model');
const hooks = require('./marital-statuses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'marital-statuses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/marital-statuses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('marital-statuses');

  service.hooks(hooks);
};
