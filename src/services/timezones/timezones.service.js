// Initializes the `timezones` service on path `/timezones`
const createService = require('feathers-mongoose');
const createModel = require('../../models/timezones.model');
const hooks = require('./timezones.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'timezones',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/timezones', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('timezones');

  service.hooks(hooks);
};
