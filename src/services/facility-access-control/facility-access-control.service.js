// Initializes the `facilityAccessControl` service on path `/facility-access-control`
const createService = require('feathers-mongoose');
const createModel = require('../../models/facility-access-control.model');
const hooks = require('./facility-access-control.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'facility-access-control',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/facility-access-control', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('facility-access-control');

    service.hooks(hooks);
};