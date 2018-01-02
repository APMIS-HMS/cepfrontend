// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');
const logger = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return new Promise(function (resolve, reject) {
      if (context && context.app) {
        context.app.service('get-tokens').get(tokenLabel.tokenType.apmisId, {}).then(result => {
          context.data.apmisId = result.apmisId;
          resolve(context);
        }, error =>{
          logger.error(error.message);
          reject(error);
        });
      } else {
        resolve(context);
      }

    });
  };
};
