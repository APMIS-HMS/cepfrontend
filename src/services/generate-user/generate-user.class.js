/* eslint-disable no-unused-vars */
const logger = require('winston');
const sms = require('../../templates/sms-sender');
const tokenLabel = require('../../parameters/token-label');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    const userService = this.app.service('users');
    // const personService = this.app.service('people');
    const getTokenService = this.app.service('get-tokens');

    return new Promise(function (resolve, reject) {
      getTokenService.get(tokenLabel.tokenType.autoPassword, {}).then(smsPayload => {
        data.password = smsPayload.result;
        if (data.facilityId !== undefined) {
          data.facilitiesRole = [];
          data.facilitiesRole.push({ facilityId: data.facilityId });
        }

        userService.create(data).then(facPayload => {
          // sms.sendAutoGeneratorPassword(payload, smsPayload.result);
          resolve(facPayload);
        }, facError => {
          reject(facError);
        });
      }, error => {
        reject(error);
      });
    });
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
