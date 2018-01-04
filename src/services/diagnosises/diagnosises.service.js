// Initializes the `diagnosises` service on path `/diagnosises`
const createService = require('feathers-mongoose');
const createModel = require('../../models/diagnosises.model');
const hooks = require('./diagnosises.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'diagnosises',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/diagnosises', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('diagnosises');

  service.hooks(hooks);
};
