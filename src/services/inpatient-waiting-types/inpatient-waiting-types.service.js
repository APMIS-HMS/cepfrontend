// Initializes the `inpatientWaitingTypes` service on path `/inpatient-waiting-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inpatient-waiting-types.model');
const hooks = require('./inpatient-waiting-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inpatient-waiting-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inpatient-waiting-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inpatient-waiting-types');

  service.hooks(hooks);
};
