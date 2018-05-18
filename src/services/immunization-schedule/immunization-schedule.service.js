// Initializes the `immunization_schedule` service on path `/immunization-schedule`
const createService = require('feathers-mongoose');
const createModel = require('../../models/immunization-schedule.model');
const hooks = require('./immunization-schedule.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');
    const options = {
        name: 'immunization-schedule',
        paginate,
        Model
    };

    // Initialize our service with any options it requires
    app.use('/immunization-schedule', createService(options));
    // Get our initialized service so that we can register hooks and filters
    const service = app.service('immunization-schedule');

    service.hooks(hooks);
};