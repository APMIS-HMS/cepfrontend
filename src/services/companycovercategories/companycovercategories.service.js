// Initializes the `companycovercategories` service on path `/companycovercategories`
const createService = require('feathers-mongoose');
const createModel = require('../../models/companycovercategories.model');
const hooks = require('./companycovercategories.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'companycovercategories',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/companycovercategories', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('companycovercategories');

  service.hooks(hooks);
};
