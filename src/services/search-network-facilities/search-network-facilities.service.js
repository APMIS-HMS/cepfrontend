// Initializes the `searchNetworkFacilities` service on path `/search-network-facilities`
const createService = require('./search-network-facilities.class.js');
const hooks = require('./search-network-facilities.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search-network-facilities',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/search-network-facilities', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search-network-facilities');

  service.hooks(hooks);
};
