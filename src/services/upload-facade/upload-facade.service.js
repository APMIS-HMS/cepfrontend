// Initializes the `upload-facade` service on path `/upload-facade`
const createService = require('./upload-facade.class.js');
const hooks = require('./upload-facade.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'upload-facade',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/upload-facade', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-facade');

  service.hooks(hooks);
};
