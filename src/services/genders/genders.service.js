// Initializes the `genders` service on path `/genders`
const createService = require('feathers-mongoose');
const createModel = require('../../models/genders.model');
const hooks = require('./genders.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'genders',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/genders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('genders');

  service.hooks(hooks);
};
