// Initializes the `cashPament` service on path `/cash-pament`
const createService = require('./cash-payment.class.js');
const hooks = require('./cash-payment.hooks');

module.exports = function (app) {
  
    const paginate = app.get('paginate');

    const options = {
        name: 'cash-payment',
        paginate,
        app:app
    };

    // Initialize our service with any options it requires
    app.use('/cash-payment', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('cash-payment');

    service.hooks(hooks);
};
