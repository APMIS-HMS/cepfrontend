// Initializes the `add-addendum` service on path `/add-addendum`
const createService = require('./add-addendum.class.js');
const hooks = require('./add-addendum.hooks');

module.exports = function(app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'add-addendum',
        paginate,
        app: app
    };

    // Initialize our service with any options it requires
    app.use('/add-addendum', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('add-addendum');

    service.hooks(hooks);
};