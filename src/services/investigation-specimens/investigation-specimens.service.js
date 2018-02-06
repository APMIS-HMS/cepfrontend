// Initializes the `investigation-specimens` service on path `/investigation-specimens`
const createService = require('feathers-mongoose');
const createModel = require('../../models/investigation-specimens.model');
const hooks = require('./investigation-specimens.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'investigation-specimens',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/investigation-specimens', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('investigation-specimens');

  service.hooks(hooks);
};
