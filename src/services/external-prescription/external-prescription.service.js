// Initializes the `externalPrescription` service on path `/external-prescriptions`
const createService = require('feathers-mongoose');
const createModel = require('../../models/external-prescription.model');
const hooks = require('./external-prescription.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'external-prescription',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/external-prescriptions', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('external-prescriptions');

    service.hooks(hooks);
};
