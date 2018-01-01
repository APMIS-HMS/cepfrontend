// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');
const emailer = require('../templates/emailer');
const sms = require('../templates/sms-sender');


module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    return new Promise(function (resolve, reject) {
      if (context && context.app) {
        context.app.service('get-tokens').get(tokenLabel.tokenType.facilityVerification, {}).then(result => {
          context.result.verificationToken = result.token;
          context.service.update(context.result._id, context.result).then(facility => {
            context.result = facility;
            emailer.sendToken(facility);
            sms.sendToken(facility);
            resolve(context);
          }, error => {
            reject(error);
          });

        });
      } else {
        resolve(context);
      }

    });
  };
};