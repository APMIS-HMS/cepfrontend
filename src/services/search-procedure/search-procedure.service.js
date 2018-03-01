// Initializes the `search-procedure` service on path `/search-procedure`
const createService = require('./search-procedure.class.js');
const hooks = require('./search-procedure.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'search-procedure',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/search-procedure', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('search-procedure');

    service.hooks(hooks);
};