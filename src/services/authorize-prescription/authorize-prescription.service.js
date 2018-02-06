// Initializes the `authorize-prescription` service on path `/authorize-prescription`
const createService = require('./authorize-prescription.class.js');
const hooks = require('./authorize-prescription.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'authorize-prescription',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/authorize-prescription', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('authorize-prescription');

    service.hooks(hooks);
};