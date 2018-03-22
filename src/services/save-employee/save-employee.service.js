// Initializes the `save-employee` service on path `/save-employee`
const createService = require('./save-employee.class.js');
const hooks = require('./save-employee.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'save-employee',
        paginate: 100,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/save-employee', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('save-employee');

    service.hooks(hooks);
};