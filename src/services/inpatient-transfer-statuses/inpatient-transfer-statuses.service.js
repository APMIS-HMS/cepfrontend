// Initializes the `inpatientTransferStatuses` service on path `/inpatient-transfer-statuses`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inpatient-transfer-statuses.model');
const hooks = require('./inpatient-transfer-statuses.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inpatient-transfer-statuses',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inpatient-transfer-statuses', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inpatient-transfer-statuses');

  service.hooks(hooks);
};
