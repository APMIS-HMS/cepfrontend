// Initializes the `docUpload` service on path `/doc-upload`
const createService = require('feathers-mongoose');
const createModel = require('../../models/doc-upload.model');
const hooks = require('./doc-upload.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'doc-upload',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/doc-upload', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('doc-upload');

  service.hooks(hooks);
};
