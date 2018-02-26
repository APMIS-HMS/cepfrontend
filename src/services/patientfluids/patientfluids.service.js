// Initializes the `patientfluids` service on path `/patientfluids`
const createService = require('feathers-mongoose');
const createModel = require('../../models/patientfluids.model');
const hooks = require('./patientfluids.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'patientfluids',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patientfluids', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('patientfluids');

  service.hooks(hooks);
};
