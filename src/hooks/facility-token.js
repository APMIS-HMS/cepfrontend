// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');
const logger = require('winston');


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return new Promise(function (resolve, reject) {
      context.app.service('get-tokens').get(tokenLabel.tokenType.facilityVerification, {}).then(result => {
        context.result.verificationToken = result.token;
        context.service.update(context.result._id, context.result).then(facility => {
          context.result = facility;
          resolve(context);
        }, error => {
          reject(error);
        });

      });
    });
  };
};