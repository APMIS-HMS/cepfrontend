// Initializes the `formTypes` service on path `/form-types`
const createService = require('feathers-mongoose');
const createModel = require('../../models/form-types.model');
const hooks = require('./form-types.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'form-types',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/form-types', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('form-types');

  service.hooks(hooks);
};
