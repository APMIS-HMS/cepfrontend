// Initializes the `crud-immunization-schedule` service on path `/crud-immunization-schedule`
const createService = require('./crud-immunization-schedule.class.js');
const hooks = require('./crud-immunization-schedule.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/crud-immunization-schedule', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('crud-immunization-schedule');

    service.hooks(hooks);
};