// Initializes the `dispenseAssessment` service on path `/dispense-assessments`
const createService = require('feathers-mongoose');
const createModel = require('../../models/dispense-assessment.model');
const hooks = require('./dispense-assessment.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'dispense-assessment',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/dispense-assessments', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('dispense-assessments');

  service.hooks(hooks);
};
