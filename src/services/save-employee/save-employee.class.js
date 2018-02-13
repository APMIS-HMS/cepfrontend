/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  find(params) {
    return Promise.resolve([]);
  }

  async get(id, params) {
    const employeeService = this.app.service('employees');
    const workspaceService = this.app.service('workspaces');
    const facilitiesService = this.app.service('facilities');
    const storeService = this.app.service('stores');
    const personId = params.user.personId;
    let selectedfacility = await facilitiesService.get(id);
    let selectedEmployee = await employeeService.find({
      query: {
        facilityId: id,
        personId: personId
      }
    });
    if (selectedEmployee.data.length > 0) {
      let emp = selectedEmployee.data[0];
      let workspaces = await workspaceService.find({
        query: {
          facilityId: id,
          employeeId: emp._id
        }
      });
      emp.workSpaces = workspaces.data;
      if (emp.workSpaces.length > 0) {
        let len = emp.workSpaces.length - 1;
        for (let i = len; i >= 0; i--) {
          if (emp.workSpaces[i].locations.length > 0) {
            let len2 = emp.workSpaces[i].locations.length - 1;
            for (let j = len2; j >= 0; j--) {
              if (selectedfacility.minorLocations.length > 0) {
                let loc = selectedfacility.minorLocations.filter(x => x._id.toString() === emp.workSpaces[i].locations[j].minorLocationId.toString());
                emp.workSpaces[i].locations[j].name = loc[0].name;
                if (emp.storeCheckIn != undefined) {
                  if (emp.storeCheckIn.length > 0) {
                    let index = emp.storeCheckIn.filter(x => x.minorLocationId.toString() === emp.workSpaces[i].locations[j].minorLocationId.toString());
                    if (index.length > 0) {
                      index[0].minorLocation = loc[0].name;
                    }
                  }
                }
              }
            }
          }
        }
      }
      let storeItems = await storeService.find({
        query: {
          facilityId: id
        }
      });
      if (emp.storeCheckIn != undefined) {
        if (emp.storeCheckIn.length > 0) {
          if (storeItems.data != undefined) {
            if (storeItems.data.length > 0) {
              let len3 = storeItems.data.length - 1;
              for (let k = len3; k >= 0; k--) {
                let index3 = emp.storeCheckIn.filter(x => x.storeId.toString() === storeItems.data[k]._id.toString());
                if (index3.length > 0) {
                  index3[0].store = storeItems.data[k].name;
                }
              }
            }
          }
        }
      }
      selectedEmployee.data[0] = emp;
      return selectedEmployee;
    } else {
      return {};
    }

  }

  async create(data, params) {
    // const employeeService = this.app.service('employees');
    const userService = this.app.service('users');
    let userList = await userService.find({
      query: {
        personId: data.personId
      }
    });
    if (userList.data.length > 0) {
      let selectedUser = userList.data[0];
      if (selectedUser.facilitiesRole === undefined) {
        selectedUser.facilitiesRole = [];
      }
      let facilityRole = {
        facilityId: data.facilityId,
      };
      let facilitiesRole = selectedUser.facilitiesRole;
      facilitiesRole.push(facilityRole);
      let patchedUser = await userService.patch(selectedUser._id, {
        facilitiesRole: facilitiesRole
      });
      return patchedUser;

    } else {
      return [];


    }
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
