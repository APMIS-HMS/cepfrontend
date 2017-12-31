'use strict';
const request = require('request');

function sender(mesage, data) {
  const url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&sender=APMIS&mobiles=@@' + data.contactPhoneNo + '@@';
  request.get(url);
}

function sendToken(data) {
  const message = 'Kindly login to www.apmis.com with your ApmisId or email address to complete your registration by verifing your account with this OTP code: ' + data.verificationToken + ' to complete your registration';
  sender(message, data);
}

module.exports = {
  sendToken: function (data) {
    sendToken(data);
  }
};
