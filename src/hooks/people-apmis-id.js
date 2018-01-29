// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return new Promise(function (resolve, reject) {
      if (context && context.app) {
        context.app.service('get-tokens').get(tokenLabel.tokenType.apmisId, {}).then(payload => {
          context.data.apmisId = payload.result;
          context.alertType = tokenLabel.tokenType.apmisId;
          resolve(context);
        }, error => {
          reject(error);
        });
      } else {
        resolve(context);
      }

    });
  };
};
