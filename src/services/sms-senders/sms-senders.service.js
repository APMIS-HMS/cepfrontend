// Initializes the `smsSenders` service on path `/sms-senders`
const createService = require('./sms-senders.class.js');
const hooks = require('./sms-senders.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    name: 'sms-senders',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/sms-senders', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('sms-senders');

  service.hooks(hooks);
};
