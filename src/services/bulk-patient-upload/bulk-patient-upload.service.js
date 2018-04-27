// Initializes the `bulk-patient-upload` service on path `/bulk-patient-upload`
const createService = require('./bulk-patient-upload.class.js');
const hooks = require('./bulk-patient-upload.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'bulk-patient-upload',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bulk-patient-upload', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bulk-patient-upload');

  service.hooks(hooks);
};
