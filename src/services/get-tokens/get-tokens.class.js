/* eslint-disable no-unused-vars */
const logger = require('winston');
const tokenLabel = require('../../parameters/token-label');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  generateOtp() {
    var otp = '';
    var possible = '0123456789';
    for (var i = 0; i <= 5; i++) {
      otp += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return otp;
  }

  get(id, param) {
    let data = {
      token: 0
    };
    if (id.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    }
    return Promise.resolve(data);
  }

  find(id, param) {
    let data = {
      token: 0
    };
    if (id.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    }
    return Promise.resolve(data);
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
