// Initializes the `fundWallet` service on path `/fund-wallet`
const createService = require('./fund-wallet.class.js');
const hooks = require('./fund-wallet.hooks');

module.exports = function (app) {

    const paginate = app.get('paginate');

    const options = {
        name: 'fund-wallet',
        paginate,
        app: app};

    // Initialize our service with any options it requires
    app.use('/fund-wallet', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('fund-wallet');

    service.hooks(hooks);
};