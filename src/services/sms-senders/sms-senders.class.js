/* eslint-disable no-unused-vars */
const smsLabel = require('../../parameters/sms-label');
const smsTemplate = require('../../templates/sms-sender');
class Service {
    constructor (options) {
        this.options = options || {};
    }

    find (params) {
        return Promise.resolve([]);
    }

    get (id, params) {
        return Promise.resolve({
            id, text: `A new message with ID: ${id}!`
        });
    }

    create (data, params) {
        if (params.query.label.toString() == smsLabel.smsType.facilityToken.toString()) {
            smsTemplate.sendToken(data);
        }
        return Promise.resolve(data);
    }

    update (id, data, params) {
        return Promise.resolve(data);
    }

    patch (id, data, params) {
        return Promise.resolve(data);
    }

    remove (id, params) {
        return Promise.resolve({ id });
    }
}

module.exports = function (options) {
    return new Service(options);
};

module.exports.Service = Service;
