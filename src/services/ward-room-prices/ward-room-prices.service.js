// Initializes the `ward-room-prices` service on path `/ward-room-prices`
const createService = require('./ward-room-prices.class.js');
const hooks = require('./ward-room-prices.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'ward-room-prices',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/ward-room-prices', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('ward-room-prices');

    service.hooks(hooks);
};