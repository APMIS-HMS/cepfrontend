'use strict';
const request = require('request');
const logger = require('winston');

function sender(mesage, data, isScheduler) {
  var url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
  if (isScheduler == true) {
    url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&action=scheduled' + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
  }
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
  sender(message, data, false);
}

function sendPasswordResetToken(data) {
  const message = 'Complete your password reset by verifing your account with this OTP: ' + data.verificationToken + ' to complete your registration';
  sender(message, data, false);
}

function sendApmisId(data) {
  const message = 'This is to notify you that ' + data.apmisId + ' is your personal APMIS identification number. Visit www.apmis.ng/details for details';
  sender(message, data, false);
}

function sendAutoGeneratorPassword(data, password) {
  const message = 'APMIS Auto-generated password: ' + password + ' kindly change your password';
  sender(message, data, false);
}

function sendScheduleAppointment(date, data) {
  var message = '';
  if (data.doctorId != undefined) {
    message = 'This is to notify you of your appointment with ' + data.doctorId.employeeDetails.firstName + ' ' + data.doctorId.employeeDetails.lastName + ' scheduled for: ' + date + ' at ' + data.facilityId.name + ' ' + data.clinicId.clinicName + ' clinic';
  } else {
    message = 'This is to notify you of your appointment scheduled for: ' + date + ' at ' + data.facilityId.name + ' ' + data.clinicId.clinicName + ' clinic';
  }
  data.primaryContactPhoneNo = data.patientId.personDetails.primaryContactPhoneNo;
  sender(message, data, true);
}



module.exports = {
  sendToken(data) {
    sendToken(data);
  },
  sendPasswordResetToken(data) {
    sendPasswordResetToken(data);
  },
  sendApmisId(data) {
    sendApmisId(data);
  },
  sendAutoGeneratorPassword(data, password) {
    sendAutoGeneratorPassword(data, password);
  },
  sendScheduleAppointment(date, data) {
    sendScheduleAppointment(date, data);
  }
};
