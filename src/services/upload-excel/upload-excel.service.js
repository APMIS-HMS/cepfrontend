// Initializes the `upload-excel` service on path `/upload-excel`
const createService = require('./upload-excel.class.js');
const hooks = require('./upload-excel.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'upload-excel',
    paginate,
    app: app
  };

  // Initialize our service with any options it requires
  app.use('/upload-excel', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('upload-excel');

  service.hooks(hooks);
};
