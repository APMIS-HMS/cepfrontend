/* eslint-disable no-unused-vars */
const logger = require('winston');
const sms = require('../../templates/sms-sender');
const tokenLabel = require('../../parameters/token-label');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    const userService = this.app.service('users');
    const personService = this.app.service('people');
    const getTokenService = this.app.service('get-tokens');

    return new Promise(function (resolve, reject) {
      personService.create(data).then(payload => {
        if (payload) {
          const user = {
            email: payload.apmisId
          };
          user.personId = payload._id;
          getTokenService.get(tokenLabel.tokenType.autoPassword, {}).then(smsPayload => {
            user.password = smsPayload.result;
            userService.create(user).then(facPayload => {
              sms.sendAutoGeneratorPassword(payload, smsPayload.result);
              resolve(facPayload);
            }, facError => {
              reject(facError);
            });
          }, error => {
            logger.error(error.message);
            reject(error);
          });
        }
      }, error => {
        reject(error);
      });
    });

    // if (Array.isArray(data)) {
    //   return Promise.all(data.map(current => this.create(current)));
    // }

    // return Promise.resolve(data);
  }

  update(id, data, params) {
    return Promise.resolve(data);
  }

  patch(id, data, params) {
    return Promise.resolve(data);
  }

  remove(id, params) {
    return Promise.resolve({ id });
  }

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
