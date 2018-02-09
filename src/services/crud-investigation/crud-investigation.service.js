// Initializes the `crud-investigation` service on path `/crud-investigation`
const createService = require('./crud-investigation.class.js');
const hooks = require('./crud-investigation.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'crud-investigation',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/crud-investigation', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('crud-investigation');

    service.hooks(hooks);
};