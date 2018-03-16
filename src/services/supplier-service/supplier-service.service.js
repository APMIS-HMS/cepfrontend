// Initializes the `supplier-service` service on path `/supplier-service`
const createService = require('./supplier-service.class.js');
const hooks = require('./supplier-service.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'supplier-service',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/supplier-service', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('supplier-service');

    service.hooks(hooks);
};