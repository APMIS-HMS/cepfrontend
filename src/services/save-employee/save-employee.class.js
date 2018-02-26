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
    const personId = params.user.personId;
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
      return {
        selectedEmployee: emp,
        selectedUser: params.user
      };
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
        facilityId: data.facilityId
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
