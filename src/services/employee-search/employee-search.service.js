// Initializes the `employee-search` service on path `/employee-search`
const createService = require('./employee-search.class.js');
const hooks = require('./employee-search.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'employee-search',
        paginate,
        app: app,
    };

    // Initialize our service with any options it requires
    app.use('/employee-search', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('employee-search');

    service.hooks(hooks);
};