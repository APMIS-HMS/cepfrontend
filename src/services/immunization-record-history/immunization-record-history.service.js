// Initializes the `immunizationRecordHistory` service on path `/immunization-record-history`
const createService = require('feathers-mongoose');
const createModel = require('../../models/immunization-record-history.model');
const hooks = require('./immunization-record-history.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'immunization-record-history',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/immunization-record-history', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('immunization-record-history');

    service.hooks(hooks);
};
