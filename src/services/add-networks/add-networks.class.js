/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor (options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
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
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    var successes = [];
    return new Promise(function (resolve, reject) {
      data.memberFacilities.forEach((current, i) => {
        facilitiesService.get(current, {}).then(networkMember => {
          let memberof = [];
          memberof.push(data.hostId);
          facilitiesService.patch(networkMember._id,{ memberof: memberof }).then(networkMember => {
            results.push(networkMember);
            facilitiesService.get(data.hostId, {}).then(networkHost => {
              let memberFacilities = [];
              memberFacilities.push(current);
              facilitiesService.patch(networkHost._id,{ memberFacilities: memberFacilities }).then(payload => {
                successes.push(payload);
                if (i == data.memberFacilities.length - 1) {
                  resolve(successes);
                }
              }, error => {
                errors.push(error);
                if (i == data.memberFacilities.length - 1) {
                  reject(errors);
                }
              });
            });
          },error=>{
            //logger.info(error);
          });
        });
      });
    });
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
