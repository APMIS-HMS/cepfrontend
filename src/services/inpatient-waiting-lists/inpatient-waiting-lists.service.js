// Initializes the `inpatientWaitingLists` service on path `/inpatient-waiting-lists`
const createService = require('feathers-mongoose');
const createModel = require('../../models/inpatient-waiting-lists.model');
const hooks = require('./inpatient-waiting-lists.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'inpatient-waiting-lists',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inpatient-waiting-lists', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('inpatient-waiting-lists');

  service.hooks(hooks);
};
