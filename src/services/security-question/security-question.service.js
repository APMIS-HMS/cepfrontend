// Initializes the `security-question` service on path `/security-questions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/security-question.model');
const hooks = require('./security-question.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'security-question',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/security-questions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('security-questions');

  service.hooks(hooks);
};
