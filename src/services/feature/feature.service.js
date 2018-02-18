// Initializes the `feature` service on path `/features`
const createService = require('feathers-mongoose');
const createModel = require('../../models/feature.model');
const hooks = require('./feature.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'feature',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/features', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('features');

    service.hooks(hooks);
};