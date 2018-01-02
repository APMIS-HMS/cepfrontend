// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');
const emailer = require('../templates/emailer');
const sms = require('../templates/sms-sender');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    if (context.alertType.toString() == tokenLabel.tokenType.facilityVerification.toString()) {
      delete context.alertType;
      emailer.sendToken(context.result);
      sms.sendToken(context.result);
    } else if (context.alertType.toString() == tokenLabel.tokenType.apmisId.toString()) {
      delete context.alertType;
      if (context.result.email != undefined) {
        emailer.sendApmisId(context.result);
      }
      sms.sendApmisId(context.result);
    }
    return Promise.resolve(context);
  };
};
