'use strict';
const request = require('request');
const querystring = require('querystring');
const https = require('https');

function sender(mesage, data, isScheduler) {
    var url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
    if (isScheduler == true) {
        url = 'http://portal.bulksmsnigeria.net/api/?username=apmis&password=apmis&message=' + mesage + '&action=scheduled' + '&sender=APMIS&mobiles=@@' + data.primaryContactPhoneNo + '@@';
    }
    request.get(url, null, (error, response, body) => {
        if (error) {}
        if (response && body) {}
    });
}

function getPhoneNumber(number) {
    if (number.length === 11) {
        var inNumber = number.substring(1);
        return '+234' + inNumber;
    }
    return number;
}

function africas_sender(message, data, isScheduler) {
    var username = process.env.AFRICASTALKINGUSERNAME;
    var apikey = process.env.AFRICASTALKINGKEY;
    var to = getPhoneNumber(data.primaryContactPhoneNo);
    var post_data = querystring.stringify({
        'username': username,
        'to': to,
        'from': 34461,
        'message': message
    });

    var post_options = {
        host: 'api.africastalking.com',
        path: '/version1/messaging',
        method: 'POST',

        rejectUnauthorized: false,
        requestCert: true,
        agent: false,

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length,
            'Accept': 'application/json',
            'apikey': apikey
        }
    };

    var post_req = https.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            var jsObject = JSON.parse(chunk);
            var recipients = jsObject.SMSMessageData.Recipients;
            if (recipients.length > 0) {
                // for (var i = 0; i < recipients.length; ++i) {
                //     var logStr = 'number=' + recipients[i].number;
                //     logStr += ';cost=' + recipients[i].cost;
                //     logStr += ';status=' + recipients[i].status; // status is either "Success" or "error message"
                //     console.log(logStr);
                // }
            } else {
                // console.log('Error while sending: ' + jsObject.SMSMessageData.Message);
            }
        });
    });

    // Add post parameters to the http request
    post_req.write(post_data);

    post_req.end();
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
        message = 'This is to notify you of your appointment with ' + data.providerDetails.personDetails.title + ' ' + data.providerDetails.personDetails.lastName + ' ' + data.providerDetails.personDetails.firstName + ' scheduled for: ' + data.startDate + ' at ' + data.patientDetails.facilityObj.name + ' ' + data.clinicId + ' clinic';
    } else {
        message = 'This is to notify you of your appointment scheduled for: ' + data.startDate + ' at ' + data.patientDetails.facilityObj.name + ' in ' + data.clinicId + ' clinic';
    }
    data.primaryContactPhoneNo = data.patientDetails.personDetails.primaryContactPhoneNo;
    africas_sender(message, data, true);
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