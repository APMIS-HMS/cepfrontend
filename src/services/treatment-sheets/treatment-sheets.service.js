// Initializes the `treatment-sheets` service on path `/treatment-sheets`
const createService = require('feathers-mongoose');
const createModel = require('../../models/treatment-sheets.model');
const hooks = require('./treatment-sheets.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'treatment-sheets',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/treatment-sheets', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('treatment-sheets');

  service.hooks(hooks);
};
