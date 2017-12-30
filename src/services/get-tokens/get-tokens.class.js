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
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
    for (var i = 0; i < 2; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
  getApmisId() {
    var number = Math.floor(Math.random() * 99999) + 1;
    if (number.length <= 5) {
      number = String("00000" + number).slice(-5);
    }
    var retVal = makeid() + "-" + number;
    return retVal;
  }
  
  generateId() {
  
    const persons = app.service('people');
    const generateApmisId = getApmisId();
    let apmisNo = generateApmisId;
    return persons.find({
      query: { apmisId: apmisNo }
    }).then(personsApmisReturn => {
      if (personsApmisReturn.data.length == 0) {
        return persons.find({
          query: { email: v.data.email }
        }).then(personReturns => {
  
          if (personReturns.data.length != 0 && v.data.email != undefined) {
            throw new Error('This email already exist');
          }
          else {
            v.data.apmisId = apmisNo;
  
            const message = "This is to notify you that " + v.data.apmisId + " is your personal APMIS identification number. Visit www.apmis.ng/details for details";
            const url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + message + '&sender=APMIS&mobiles=@@' + v.data.phoneNumber + '@@';
            var response = request.get(url);
            emailTemplate.apmisId(v.data);
          }
        });
  
      }
      else {
        return generateId(v);
      }
      v.generateapmisid = true;
    }); 
  };

  get(param) {
    let data = {
      token: 0
    };
    if (param.query.label.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    }else if (param.query.label.toString() === tokenLabel.tokenType.apmisId.toString()) {
      data.token = this.generateOtp();
    }
    return Promise.resolve(data);
  }

  find(param) {
    let data = {
      token: 0
    };
    if (param.query.label.toString() === tokenLabel.tokenType.facilityVerification.toString()) {
      data.token = this.generateOtp();
    }
    return Promise.resolve(data);
  }

}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
