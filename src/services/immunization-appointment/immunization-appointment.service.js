// Initializes the `immunizationAppointment` service on path `/immunization-appointment`
const createService = require('feathers-mongoose');
const createModel = require('../../models/immunization-appointment.model');
const hooks = require('./immunization-appointment.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'immunization-appointment',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/immunization-appointment', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('immunization-appointment');

    service.hooks(hooks);
};
