/* eslint-disable no-unused-vars */
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

  getMemberFacilities(id, params) {
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    return new Promise(function (resolve, reject) {
      facilitiesService.get(id, {}).then(networkMember => {
        facilitiesService.find({
          query: {
            name: {
              $regex: params.query.name,
              '$options': 'i'
            }
          }
        }).then(memberFacilities => {
          memberFacilities.data.forEach((facility, i) => {
            let index = facility.memberof.filter(x => x.toString() == id.toString());
            if (index.length > 0) {
              facility.isMember = true;
              results.push(facility);
            } else {
              facility.isMember = false;
              results.push(facility);
            }
            if (i == memberFacilities.data.length - 1) {
              resolve(results)
            }
          }, error => {
            reject(error);
          });
        }, error => {
          reject(error);
        });
      });
    });
  }

  getMemberOf(id, params) {
    const facilitiesService = this.app.service('facilities');
    var results = [];
    var errors = [];
    return new Promise(function (resolve, reject) {
      facilitiesService.get(id, {}).then(networkMember => {
        facilitiesService.find({
          query: {
            name: {
              $regex: params.query.name,
              '$options': 'i'
            }
          }
        }).then(memberFacilities => {
          memberFacilities.data.forEach((facility, i) => {
            let index = facility.memberFacilities.filter(x => x.toString() == id.toString());
            if (index.length > 0) {
              facility.isMember = true;
              results.push(facility);
            } else {
              facility.isMember = false;
              results.push(facility);
            }
            if (i == memberFacilities.data.length - 1) {
              resolve(results)
            }
          }, error => {
            reject(error);
          });
        }, error => {
          reject(error);
        });
      });
    });
  }

  create(data, params) {

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
