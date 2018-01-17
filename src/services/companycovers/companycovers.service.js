// Initializes the `companycovers` service on path `/companycovers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/companycovers.model');
const hooks = require('./companycovers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'companycovers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/companycovers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('companycovers');

  service.hooks(hooks);
};
