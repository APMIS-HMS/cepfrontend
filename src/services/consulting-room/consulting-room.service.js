// Initializes the `consultingRoom` service on path `/consulting-rooms`
const createService = require('feathers-mongoose');
const createModel = require('../../models/consulting-room.model');
const hooks = require('./consulting-room.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'consulting-room',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/consulting-rooms', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('consulting-rooms');

  service.hooks(hooks);
};
