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

  async get(id, params) {
    const usersService = this.app.service('users');
    const featuresService = this.app.service('features');
    var results = [];
    var errors = [];

    let selectedUser = await usersService.find({
      query: {
        'personId': id
      }
    });
    let features = await featuresService.find({});
    if (selectedUser.data.length == 0) {
      results = [];
    } else {
      if (selectedUser.data[0].userRole) {
        let index = selectedUser.data[0].userRole.filter(x => x.facilityId.toString() == params.query.facilityId.toString());

        if(index[0].roles.length > 0){
          features.data.forEach((feature, i) => {
            if (index[0].roles.includes(feature._id.toString())) {
              feature.isAssigned = true;
              results.push(feature);
            } else {
              feature.isAssigned = false;
              results.push(feature);
            }
          });
        }else{
          results = [];
        }
      }
    }

    return results;
  }

  async create(data, params) {
    const usersService = this.app.service('users');
    let selectedUser = await usersService.find({
      query: {
        'personId': data.personId
      }
    });

    let index = selectedUser.data[0].userRoles.findIndex(x => x.facilityId.toString() == data.facilityId.toString());
    selectedUser.data[0].userRoles[index].roles.forEach(ind => {
      data.roles.forEach(indx => {
        if(ind != indx){
          selectedUser.data[0].userRoles[index].roles.push(indx);
        }
      })
    });

    let updatedUser = await usersService.update(selectedUser.data[0]._id, selectedUser.data[0]);
    
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
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
