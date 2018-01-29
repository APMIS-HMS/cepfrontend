// Initializes the `orderMgtTemplates` service on path `/order-mgt-templates`
const createService = require('feathers-mongoose');
const createModel = require('../../models/order-mgt-templates.model');
const hooks = require('./order-mgt-templates.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'order-mgt-templates',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/order-mgt-templates', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('order-mgt-templates');

  service.hooks(hooks);
};
