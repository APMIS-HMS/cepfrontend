// Initializes the `admit-patient` service on path `/admit-patients`
const createService = require('./admit-patient.class.js');
const hooks = require('./admit-patient.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'admit-patient',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/admit-patients', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('admit-patients');

  service.hooks(hooks);
};
