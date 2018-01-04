// Initializes the `investigationReportTypes` service on path `/investigation-report-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/investigation-report-types.model');
const hooks = require('./investigation-report-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'investigation-report-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/investigation-report-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('investigation-report-types');

  service.hooks(hooks);
};
