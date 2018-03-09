// Initializes the `cashPament` service on path `/cash-pament`
const createService = require('./cash-pament.class.js');
const hooks = require('./cash-pament.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        name: 'cash-pament',
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/cash-pament', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('cash-pament');

    service.hooks(hooks);
};
