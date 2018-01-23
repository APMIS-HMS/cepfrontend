// Initializes the `tagDictioneries` service on path `/tag-dictioneries`
const createService = require('feathers-mongoose');
const createModel = require('../../models/tag-dictioneries.model');
const hooks = require('./tag-dictioneries.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'tag-dictioneries',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/tag-dictioneries', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('tag-dictioneries');

  service.hooks(hooks);
};
