// Initializes the `get-bed-occupancy` service on path `/get-bed-occupancy`
const createService = require('./get-bed-occupancy.class.js');
const hooks = require('./get-bed-occupancy.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'get-bed-occupancy',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/get-bed-occupancy', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('get-bed-occupancy');

    service.hooks(hooks);
};