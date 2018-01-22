import {
  error
} from 'util';

/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    return Promise.resolve([]);
  }

  get(id, params) {
    const facilitiesService = this.app.service('facilities');
    var members = [];
    if (params.query.isMemberof) {
      return new Promise(function (resolve, reject) {
        facilitiesService.get(data.hostId, {}).then(networkMember => {
          networkMember.memberFacilities.forEach((item, i) => {
            members.push(members);
            if (i == networkMember.memberFacilities.length - 1) {
              resolve(members)
            }
          }, error => {
            reject(error);
          });
        });
      });
    } else {
      return new Promise(function (resolve, reject) {
        facilitiesService.get(data.hostId, {}).then(networkMember => {
          networkMember.memberFacilities.forEach((item, i) => {
            facilitiesService.get(item, {}).then(networkMemberOf => {
              members.push(networkMemberOf);
              if (i == networkMember.memberFacilities.length - 1) {
                resolve(members)
              }
            }, error => {
              reject(error);
            });
          });
        });
      });
    }

  }

  create(data, params) {
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    return new Promise(function (resolve, reject) {
      data.memberFacilities.forEach((current, i) => {
        facilitiesService.get(current, {}).then(networkMember => {
          let memberof = [];
          memberof.push(data.hostId);
          facilitiesService.patch(networkMember._id, {
            memberof: memberof
          }).then(updatedNetworkMember => {
            results.push(updatedNetworkMember);
            facilitiesService.get(data.hostId, {}).then(networkHost => {
              let memberFacilities = [];
              memberFacilities.push(current);
              facilitiesService.patch(networkHost._id, {
                memberFacilities: memberFacilities
              }).then(payload => {
                var success = {
                  "members": results,
                  "host": payload
                }
                if (i == data.memberFacilities.length - 1) {
                  resolve(success);
                }
              }, error => {
                errors.push(error);
                if (i == data.memberFacilities.length - 1) {
                  reject(errors);
                }
              });
            });
          }, error => {
            reject(error);
          });
        });
      });
    });
  }

  createNetwork(data, params) {
    const facilitiesService = this.app.service('facilities');
    return new Promise(function (resolve, reject) {
      facilitiesService.get(data.facilityId, {}).then(networkMember => {
        let memberof = [];
        memberof.push(data.hostId);
        facilitiesService.patch(networkMember._id, {
          memberof: memberof
        }).then(updateNetworkMember => {
          facilitiesService.get(data.hostId, {}).then(networkHost => {
            let memberFacilities = [];
            memberFacilities.push(data.facilityId);
            facilitiesService.patch(networkHost._id, {
              memberFacilities: memberFacilities
            }).then(payload => {
              var success = {
                "members": updateNetworkMember,
                "host": payload
              }
              resolve(success);
            }, error => {
              reject(error);
            });
          });
        }, error => {
          reject(error);
        });
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
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
