// Initializes the `companyHealthCover` service on path `/company-health-covers`
const createService = require('feathers-mongoose');
const createModel = require('../../models/company-health-cover.model');
const hooks = require('./company-health-cover.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'company-health-cover',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/company-health-covers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('company-health-covers');

  service.hooks(hooks);
};
