// Initializes the `serviceTags` service on path `/service-tags`
const createService = require('feathers-mongoose');
const createModel = require('../../models/service-tags.model');
const hooks = require('./service-tags.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'service-tags',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/service-tags', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('service-tags');

  service.hooks(hooks);
};
