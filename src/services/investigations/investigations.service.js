// Initializes the `investigations` service on path `/investigations`
const createService = require('feathers-mongoose');
const createModel = require('../../models/investigations.model');
const hooks = require('./investigations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'investigations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/investigations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('investigations');

  service.hooks(hooks);
};
