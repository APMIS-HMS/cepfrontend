// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const tokenLabel = require('../parameters/token-label');
const emailer = require('../templates/emailer');
const sms = require('../templates/sms-sender');
const logger = require('winston');

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return context => {
    logger.info(context.alertType);
    logger.info(tokenLabel.tokenType.facilityVerification.toString());
    if (context.alertType.toString() == tokenLabel.tokenType.facilityVerification.toString()) {
      logger.info(22);
      delete context.alertType;
      emailer.sendToken(context.result);
      sms.sendToken(context.result);
    } else if (context.alertType.toString() == tokenLabel.tokenType.apmisId.toString()) {
      logger.info(33);
      delete context.alertType;
      if (context.result.email != undefined) {
        logger.info(44);
        emailer.sendApmisId(context.result);
      }
      logger.info(55);
      sms.sendApmisId(context.result);
    }
    return Promise.resolve(context);
  };
};
