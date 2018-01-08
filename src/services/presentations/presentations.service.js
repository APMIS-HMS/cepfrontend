// Initializes the `presentation` service on path `/presentation`
const createService = require('feathers-mongoose');
const createModel = require('../../models/presentations.model');
const hooks = require('./presentations.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'presentations',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/presentations', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('presentations');

  service.hooks(hooks);
};
