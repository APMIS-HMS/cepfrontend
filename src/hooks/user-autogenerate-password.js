// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return new Promise(function (resolve, reject) {
      if (context && context.app && context.data.password === undefined) {
        context.app.service('get-tokens').get(tokenLabel.tokenType.autoPassword, {}).then(payload => {
          context.data.password = payload.result;
          resolve(context);
        }, error =>{
          reject(error);
        });
      } else {
        resolve(context);
      }

    });
  };
};
