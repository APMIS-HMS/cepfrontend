// Initializes the `categoryTypes` service on path `/category-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/category-types.model');
const hooks = require('./category-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'category-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/category-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('category-types');

  service.hooks(hooks);
};
