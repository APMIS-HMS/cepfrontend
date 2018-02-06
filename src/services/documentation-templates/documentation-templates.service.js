// Initializes the `documentation-templates` service on path `/documentation-templates`
const createService = require('feathers-mongoose');
const createModel = require('../../models/documentation-templates.model');
const hooks = require('./documentation-templates.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'documentation-templates',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/documentation-templates', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('documentation-templates');

  service.hooks(hooks);
};
