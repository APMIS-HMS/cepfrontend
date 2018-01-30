// Initializes the `search-people` service on path `/search-people`
const createService = require('./search-people.class.js');
const hooks = require('./search-people.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search-people',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/search-people', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search-people');

  service.hooks(hooks);
};
