// Initializes the `laboratoryReports` service on path `/laboratory-reports`
const createService = require('feathers-mongoose');
const createModel = require('../../models/laboratory-reports.model');
const hooks = require('./laboratory-reports.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'laboratory-reports',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/laboratory-reports', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('laboratory-reports');

  service.hooks(hooks);
};
