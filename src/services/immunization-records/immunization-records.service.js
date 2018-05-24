// Initializes the `immunization-records` service on path `/immunization-records`
const createService = require('./immunization-records.class.js');
const hooks = require('./immunization-records.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        name: 'immunization-records',
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/immunization-records', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('immunization-records');


    service.hooks(hooks);
};
