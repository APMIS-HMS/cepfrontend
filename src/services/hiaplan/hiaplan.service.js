// Initializes the `hiaplan` service on path `/hiaplan`
const createService = require('feathers-mongoose');
const createModel = require('../../models/hiaplan.model');
const hooks = require('./hiaplan.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'hiaplan',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/hiaplan', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('hiaplan');

  service.hooks(hooks);
};
