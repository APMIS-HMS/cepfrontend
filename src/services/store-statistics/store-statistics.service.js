// Initializes the `store-statistics` service on path `/store-statistics`
const createService = require('./store-statistics.class.js');
const hooks = require('./store-statistics.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'store-statistics',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/store-statistics', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('store-statistics');

    service.hooks(hooks);
};