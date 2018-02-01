/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(id, params) {
    return Promise.resolve([]);
  }

  get(id, params) {

    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    const userService = this.app.service('users');
    const facilityService = this.app.service('facilities');

    return new Promise(function (resolve, reject) {


      userService.find({
        query: {
          personId: data.personId
        }
      }).then(payload => {
        if (payload.data.length > 0) {
          let user = payload.data[0];
          let facility = data.facility;
          facility.wallet = {
            'transactions': [],
            'ledgerBalance': 0,
            'balance': 0
          };
          facilityService.create(facility).then(facPayload => {
            let facilityRole = {
              facilityId: facPayload._id,
            };
            let facilitiesRole = user.facilitiesRole;
            if (user.facilitiesRole === undefined) {
              facilitiesRole = [];
            }
            facilitiesRole.push(facilityRole);

            userService.patch(user._id, {
              facilitiesRole: facilitiesRole
            }).then(userPayload => {
              resolve(facPayload);
            }, userError => {
              reject(userError);
            });
          }, facError => {
            reject(facError);
          });
        }
        // resolve(payload);
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
