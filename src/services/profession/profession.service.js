// Initializes the `profession` service on path `/profession`
const createService = require('feathers-mongoose');
const createModel = require('../../models/profession.model');
const hooks = require('./profession.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'profession',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/profession', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('profession');

  service.hooks(hooks);
};
