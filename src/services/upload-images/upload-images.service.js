// Initializes the `upload-images` service on path `/upload-images`
const createService = require('./upload-images.class.js');
const hooks = require('./upload-images.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'upload-images',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/upload-images', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-images');

  service.hooks(hooks);
};
