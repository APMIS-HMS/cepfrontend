// Initializes the `assign-employee-unit` service on path `/assign-employee-unit`
const createService = require('./assign-employee-unit.class.js');
const hooks = require('./assign-employee-unit.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'assign-employee-unit',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/assign-employee-unit', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('assign-employee-unit');

  service.hooks(hooks);
};
