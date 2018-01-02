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

  makeid() {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = 0; i < 2; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  getApmisId() {
    var number = Math.floor(Math.random() * 99999) + 1;
    if (number.length <= 5) {
      number = String('00000' + number).slice(-5);
    }
    var retVal = this.makeid() + '-' + number;
    return retVal;
  }

  generateId(data) {
    let apmisNo = this.getApmisId();
    data.apmisId = apmisNo;
  }

  get(id, param) {
    let data = {};
    if (id.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    } else if (id.toString() === tokenLabel.tokenType.apmisId.toString()) {
      this.generateId(data);
    }
    return Promise.resolve(data);
  }

  find(id, param) {
    let data = {};
    if (id.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    } else if (id.toString() === tokenLabel.tokenType.apmisId.toString()) {
      this.generateId(data);
    }
    return Promise.resolve(data);
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
