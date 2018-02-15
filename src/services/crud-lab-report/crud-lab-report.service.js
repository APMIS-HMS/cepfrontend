// Initializes the `crud-lab-report` service on path `/crud-lab-report`
const createService = require('./crud-lab-report.class.js');
const hooks = require('./crud-lab-report.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'crud-lab-report',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/crud-lab-report', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('crud-lab-report');

  service.hooks(hooks);
};
