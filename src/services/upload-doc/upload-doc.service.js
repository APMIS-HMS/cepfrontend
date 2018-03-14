// Initializes the `upload-doc` service on path `/upload-doc`
const createService = require('./upload-doc.class.js');
const hooks = require('./upload-doc.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'upload-doc',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/upload-doc', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-doc');

  service.hooks(hooks);
};
