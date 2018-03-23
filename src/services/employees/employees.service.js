// Initializes the `employees` service on path `/employees`
const createService = require('feathers-mongoose');
const createModel = require('../../models/employees.model');
const hooks = require('./employees.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'employees',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/employees', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('employees');

    service.hooks(hooks);
};