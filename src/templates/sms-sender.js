'use strict';
const request = require('request');
// const logger = require('winston');

function sender(mesage, data) {
  const url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
  request.get(url, null, (error, response, body) => {
    if (error) {
      // logger.error(error);
    }
    if (response && body) {
      // logger.error(error);
    }
  });
}

function sendToken(data) {
  const message = 'Kindly login to www.apmis.com with your APMISID or email address to complete your registration by verifing your account with this OTP code: ' + data.verificationToken + ' to complete your registration';
  sender(message, data);
}

function sendApmisId(data) {
  const message = 'This is to notify you that ' + data.apmisId + ' is your personal APMIS identification number. Visit www.apmis.ng/details for details';
  sender(message, data);
}

module.exports = {
  sendToken(data) {
    sendToken(data);
  },
  sendApmisId(data) {
    sendApmisId(data);
  }
};
