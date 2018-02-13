// Initializes the `patient-search` service on path `/patient-search`
const createService = require('./patient-search.class.js');
const hooks = require('./patient-search.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'patient-search',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/patient-search', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('patient-search');

    service.hooks(hooks);
};