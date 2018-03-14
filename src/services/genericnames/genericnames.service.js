// Initializes the `genericnames` service on path `/genericnames`
const createService = require('feathers-mongoose');
const createModel = require('../../models/genericnames.model');
const hooks = require('./genericnames.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'genericnames',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/genericnames', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('genericnames');

  service.hooks(hooks);
};
