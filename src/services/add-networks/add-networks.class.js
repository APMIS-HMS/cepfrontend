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
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    const facilitiesService = this.app.service('facilities');
    var results = [];
    if (Array.isArray(data)) {
      return Promise.all(data.memberFacilities.map(current => {
        facilitiesService.get(current, {}).then(networkMember => {
          networkMember.memberof.push(data.hostId);
          facilitiesService.update(networkMember,networkMember._id).then(networkMember => {
            results.push(networkMember);
            facilitiesService.get(data.hostId, {}).then(networkHost => {
              networkHost.memberFacilities.push(current);
              facilitiesService.update(networkHost,networkHost._id);
            });
          });
        });
      }));
    }

    return Promise.resolve(networkMember);
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

  setup(app) {
    this.app = app;
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
