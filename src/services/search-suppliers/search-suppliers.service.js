// Initializes the `search-suppliers` service on path `/search-suppliers`
const createService = require('./search-suppliers.class.js');
const hooks = require('./search-suppliers.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search-suppliers',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/search-suppliers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search-suppliers');

  service.hooks(hooks);
};
