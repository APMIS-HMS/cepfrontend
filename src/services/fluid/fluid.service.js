// Initializes the `fluid` service on path `/fluid`
const createService = require('feathers-mongoose');
const createModel = require('../../models/fluid.model');
const hooks = require('./fluid.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'fluid',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fluid', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('fluid');

  service.hooks(hooks);
};
