/* eslint-disable no-unused-vars */
const logger = require('winston');
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const facilityId = params.query.facilityId;
    const featuresService = this.app.service('facility-access-control');
    let userRoles = [];
    userRoles = userRoles.concat.apply([], params.user.userRoles).map(x => x.roles);

    userRoles = [].concat.apply([], userRoles);
    let features = await featuresService.find({
      query: {
        facilityId: facilityId,
        _id: { $in: userRoles }
      }
    });

    let outArray = [];
    outArray = outArray.concat(features.data.map(x => x.features));
    var merged = [].concat.apply([], outArray);
    const distinctModules = this.getDistinctModules(merged);
    return { features: merged, modules: distinctModules };
  }

  getDistinctModules(list) {
    const data = list;
    const result = Object.values(data.reduce((r, { moduleName, moduleId }) => (r[moduleName + '|' + moduleId] = { moduleName, moduleId }, r), {}));
    return result;
  }

  async get(id, params) {
    const usersService = this.app.service('users');
    const featuresService = this.app.service('facility-access-control');
    var results = [];
    var errors = [];

    let selectedUser = await usersService.find({
      query: {
        'personId': id
      }
    });
    let features = await featuresService.find({
      query: {
        facilityId: params.query.facilityId
      }
    });
    if (selectedUser.data.length == 0) {
      results = [];
    } else {
      if (selectedUser.data[0].userRoles === undefined) {
        selectedUser.data[0].userRoles = [];
      }
      if (selectedUser.data[0].userRoles) {
        let index = selectedUser.data[0].userRoles.filter(x => x.facilityId.toString() == params.query.facilityId.toString());
        if (index[0] !== undefined && index[0].roles.length > 0) {
          features.data.forEach((feature, i) => {
            if (index[0].roles.filter(x =>  x.toString() === feature._id.toString()).length > 0) {
              feature.isAssigned = true;
              results.push(feature);
            } else {
              feature.isAssigned = false;
              results.push(feature);
            }
          });
        } else {
          results = features.data;
        }
      }
    }

    return jsend.success(features.data);
  }

  async create(data, params) {
    const usersService = this.app.service('users');
    let selectedUser = await usersService.find({
      query: {
        'personId': data.personId
      }
    });

    if (selectedUser.data[0].userRoles === undefined) {
      selectedUser.data[0].userRoles = [];
    }

    let index = selectedUser.data[0].userRoles.findIndex(x => x.facilityId.toString() == data.facilityId.toString());

    // selectedUser.data[0]. [index].roles.forEach(ind => {
    //   data.roles.forEach(indx => {
    //     if (ind != indx) {
    //       selectedUser.data[0].userRoles[index].roles.push(indx);
    //     }
    //   });
    // });

    data.roles.forEach(indx => {
      if (index > -1) {
        selectedUser.data[0].userRoles[index].roles.forEach(ind => {
          if (ind != indx) {
            selectedUser.data[0].userRoles[index].roles.push(indx);
          }
        });
      } else {
        if (selectedUser.data[0].userRoles.length === 0) {
          let userRole = {
            facilityId: data.facilityId,
            roles: []
          };
          userRole.roles.push(indx);
          selectedUser.data[0].userRoles.push(userRole);
        } else {
          selectedUser.data[0].userRoles[0].roles.push(indx);
        }

      }
    });

    let updatedUser = await usersService.patch(selectedUser.data[0]._id, {
      userRoles: selectedUser.data[0].userRoles
    });

    return updatedUser;

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
