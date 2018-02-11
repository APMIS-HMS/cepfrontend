// Initializes the `get-workbenches` service on path `/get-workbenches`
const createService = require('./get-workbenches.class.js');
const hooks = require('./get-workbenches.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'get-workbenches',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/get-workbenches', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('get-workbenches');

    service.hooks(hooks);
};