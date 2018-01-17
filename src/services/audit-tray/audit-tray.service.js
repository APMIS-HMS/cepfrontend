// Initializes the `audit_tray` service on path `/audit-tray`
const createService = require('feathers-mongoose');
const createModel = require('../../models/audit-tray.model');
const hooks = require('./audit-tray.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'audit-tray',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/audit-tray', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('audit-tray');

  service.hooks(hooks);
};
