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
    if (params.query.ismember.toString() == 'true') { 
      logger.info('Am here');
      return new Promise(function (resolve, reject) {
        facilitiesService.get(id,{}).then(networkMember => {
          logger.info(networkMember.memberof.length);
          if(networkMember.memberof.length ==0){
            resolve([]);
          }
          networkMember.memberof.forEach((item, i) => {
            facilitiesService.get(item, {}).then(networkMemberOf => {
              console.log("----- Any String ---------");
              members.push(networkMemberOf);
              if (i == networkMember.memberof.length - 1) {
                resolve(members)
              }
            }, error => {
              reject(error);
            });
          });
        }, error => {
          reject(error);
        });
      });
    } else {
      logger.info('Am here 2');
      return new Promise(function (resolve, reject) {
        facilitiesService.get(id, {}).then(networkMember => {
          networkMember.memberFacilities.forEach((item, i) => {
            facilitiesService.get(item, {}).then(networkMemberOf => {
              if(networkMember.memberFacilities.length ==0){
                resolve([]);
              }
              members.push(networkMemberOf);
              if (i == networkMember.memberFacilities.length - 1) {
                resolve(members)
              }
            }, error => {
              reject(error);
            });
          });
        }, error => {
          reject(error);
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
          networkMember.memberof.push(data.hostId);
          facilitiesService.patch(networkMember._id, {
            memberof: networkMember.memberof
          }).then(updatedNetworkMember => {
            results.push(updatedNetworkMember);
            facilitiesService.get(data.hostId, {}).then(networkHost => {
              networkHost.memberFacilities.push(current);
              facilitiesService.patch(networkHost._id, {
                memberFacilities: networkHost.memberFacilities
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
    var _memberFacilities = [];
    return new Promise(function (resolve, reject) {
      data.facilityIds.forEach((current, i) => {
        facilitiesService.get(current, {}).then(networkMember => {
          networkMember.memberFacilities.push(data.hostId);
          facilitiesService.patch(networkMember._id, {
            memberFacilities: networkMember.memberFacilities
          }).then(updateNetworkMember => {
            _memberFacilities.push(updateNetworkMember);
            facilitiesService.get(data.hostId, {}).then(networkHost => {
              networkHost.memberof.push(current);
              facilitiesService.patch(networkHost._id, {
                memberof: networkHost.memberof
              }).then(payload => {
                var success = {
                  "members": memberofs,
                  "hosts": payload
                }
                if (i == data.facilityIds.length - 1) {
                  resolve(success);
                }

              }, error => {
                reject(error);
              });
            });
          }, error => {
            reject(error);
          });
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

  remove(id,params) {
    logger.info(params.memberFacilities);
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    return new Promise(function (resolve, reject) {
      params.memberFacilities.forEach((current, i) => {
        facilitiesService.get(current, {}).then(networkMember => {
          let index = networkMember.memberof.indexOf(id);
          networkMember.memberof.splice(index,1);
          facilitiesService.patch(networkMember._id, {
            memberof: networkMember.memberof
          }).then(updatedNetworkMember => {
            results.push(updatedNetworkMember);
            facilitiesService.get(id, {}).then(networkHost => {
              let index2 = networkHost.memberFacilities.indexOf(current);
              networkHost.memberFacilities.splice(index2,1);
              facilitiesService.patch(networkHost._id, {
                memberFacilities: networkHost.memberFacilities
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
