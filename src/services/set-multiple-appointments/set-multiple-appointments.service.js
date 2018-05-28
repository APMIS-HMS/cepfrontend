// Initializes the `set-multiple-appointments` service on path `/set-multiple-appointments`
const createService = require('./set-multiple-appointments.class.js');
const hooks = require('./set-multiple-appointments.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'set-multiple-appointments',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/set-multiple-appointments', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('set-multiple-appointments');

    service.hooks(hooks);
};