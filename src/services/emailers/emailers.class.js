/* eslint-disable no-unused-vars */
const emailerTemplate = require('../../templates/emailer');
const emailLabel = require('../../parameters/email-label');

class Service {
  constructor(options) {
    this.options = options || {};
  }
  create(data, params) {
    if (params.query.label.toString() == emailLabel.emailType.facilityToken.toString()) {
      emailerTemplate.sendToken(data);
    }

    return Promise.resolve(data);
  }
  
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
