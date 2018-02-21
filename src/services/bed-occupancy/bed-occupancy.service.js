// Initializes the `bedOccupancy` service on path `/bed-occupancy`
const createService = require('feathers-mongoose');
const createModel = require('../../models/bed-occupancy.model');
const hooks = require('./bed-occupancy.hooks');

module.exports = function (app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'bed-occupancy',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/bed-occupancy', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('bed-occupancy');

    service.hooks(hooks);
};
