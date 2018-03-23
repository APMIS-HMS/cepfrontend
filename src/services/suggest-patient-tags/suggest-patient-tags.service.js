// Initializes the `suggest-patient-tags` service on path `/suggest-patient-tags`
const createService = require('./suggest-patient-tags.class.js');
const hooks = require('./suggest-patient-tags.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'suggest-patient-tags',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/suggest-patient-tags', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('suggest-patient-tags');

  service.hooks(hooks);
};
