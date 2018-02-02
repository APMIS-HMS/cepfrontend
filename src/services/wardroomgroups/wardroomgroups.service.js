// Initializes the `wardroomgroups` service on path `/wardroomgroups`
const createService = require('feathers-mongoose');
const createModel = require('../../models/wardroomgroups.model');
const hooks = require('./wardroomgroups.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'wardroomgroups',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/wardroomgroups', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('wardroomgroups');

  service.hooks(hooks);
};
