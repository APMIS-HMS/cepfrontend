// Initializes the `get-server-time` service on path `/get-server-time`
const createService = require('./get-server-time.class.js');
const hooks = require('./get-server-time.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'get-server-time',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/get-server-time', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('get-server-time');

    service.hooks(hooks);
};