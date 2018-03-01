// Initializes the `dispense-prescriptions` service on path `/dispense-prescriptions`
const createService = require('./dispense-prescriptions.class.js');
const hooks = require('./dispense-prescriptions.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'dispense-prescriptions',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/dispense-prescriptions', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('dispense-prescriptions');

    service.hooks(hooks);
};