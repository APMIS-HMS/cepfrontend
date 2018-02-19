// Initializes the `price-modifiers` service on path `/price-modifiers`
const createService = require('./price-modifiers.class.js');
const hooks = require('./price-modifiers.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'price-modifiers',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/price-modifiers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('price-modifiers');

  service.hooks(hooks);
};
