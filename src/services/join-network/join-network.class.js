/* eslint-disable no-unused-vars */
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
    const facilitiesService = this.app.service('facilities');
    var _memberFacilities = [];
    if (params.query.isdelete.toString() == 'false') {
      return new Promise(function (resolve, reject) {
        data.memberFacilities.forEach((current, i) => {
          facilitiesService.get(current, {}).then(networkMember => {
            let checkId = networkMember.memberFacilities.filter(x => x.toString() == data.hostId.toString());
            if (checkId.length == 0) {
              networkMember.memberFacilities.push(data.hostId);
            }
            facilitiesService.patch(networkMember._id, {
              memberFacilities: networkMember.memberFacilities
            }).then(updateNetworkMember => {
              _memberFacilities.push(updateNetworkMember);
              facilitiesService.get(data.hostId, {}).then(networkHost => {
                let checkId2 = networkHost.memberof.filter(x => x.toString() == current.toString());
                if (checkId2.length == 0) {
                  networkHost.memberof.push(current);
                }
                facilitiesService.patch(networkHost._id, {
                  memberof: networkHost.memberof
                }).then(payload => {
                  var success = {
                    'members': _memberFacilities,
                    'hosts': payload
                  };
                  if (i == data.memberFacilities.length - 1) {
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
    } else {
      return new Promise(function (resolve, reject) {
        data.memberFacilities.forEach((current, i) => {
          facilitiesService.get(current, {}).then(networkMember => {
            let checkId = networkMember.memberFacilities.filter(x => x.toString() == data.hostId.toString());
            if (checkId.length > 0) {
              let index = networkMember.memberFacilities.indexOf(data.hostId);
              networkMember.memberFacilities.splice(index, 1);
            }
            facilitiesService.patch(networkMember._id, {
              memberFacilities: networkMember.memberFacilities
            }).then(updateNetworkMember => {
              _memberFacilities.push(updateNetworkMember);
              facilitiesService.get(data.hostId, {}).then(networkHost => {
                let checkId2 = networkMember.memberof.filter(x => x.toString() == current.toString());
                if (checkId2.length > 0) {
                  let index = networkMember.memberof.indexOf(data.hostId);
                  networkMember.memberof.splice(index, 1);
                }
                facilitiesService.patch(networkHost._id, {
                  memberof: networkHost.memberof
                }).then(payload => {
                  var success = {
                    'members': _memberFacilities,
                    'hosts': payload
                  };
                  if (i == data.memberFacilities.length - 1) {
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
