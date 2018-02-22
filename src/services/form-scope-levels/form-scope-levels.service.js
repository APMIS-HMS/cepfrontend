// Initializes the `formScopeLevels` service on path `/form-scope-levels`
const createService = require('feathers-mongoose');
const createModel = require('../../models/form-scope-levels.model');
const hooks = require('./form-scope-levels.hooks');

module.exports = function(app) {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'form-scope-levels',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/form-scope-levels', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('form-scope-levels');

    service.hooks(hooks);
};