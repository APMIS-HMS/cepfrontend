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
    const facilityService = this.app.service('facilities');
    const getTokenService = this.app.service('get-tokens');

    return new Promise(function (resolve, reject) {

      facilityService.get(data._id).then(getFac => {
        if (getFac) {
          getTokenService.get(tokenLabel.tokenType.facilityVerification, {}).then(tokenPayload => {
            getFac.verificationToken = tokenPayload.result;
            facilityService.patch(getFac._id, {verificationToken:tokenPayload.result}).then(facPayload => {
              sms.sendToken(getFac);
              resolve(facPayload);
            }, facError => {
              reject(facError);
            });
          }, error => {
            reject(error);
          });
        }else{
          resolve(getFac);
        }
      }, getFacError => {

      });


     






    });
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

  setup(app){
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
