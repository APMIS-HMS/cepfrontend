// Initializes the `searchTags` service on path `/search-tags`
const createService = require('./search-tags.class.js');
const hooks = require('./search-tags.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'search-tags',
    paginate,
    app:app
  };

  // Initialize our service with any options it requires
  app.use('/search-tags', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('search-tags');

  service.hooks(hooks);
};
