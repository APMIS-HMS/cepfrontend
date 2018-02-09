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
    console.log(1);
    const employeeService = this.app.service('employees');
    console.log(2);
    const workspaceService = this.app.service('workspaces');
    console.log(3);
    const facilitiesService = this.app.service('facilities');
    console.log(4);
    const personId = params.user.personId;
    console.log(5);
    let selectedfacility = await facilitiesService.get(id);
    console.log(6);
    let selectedEmployee = await employeeService.find({
      query: {
        facilityId: id,
        personId: personId
      }
    });
    console.log(7);
    if (selectedEmployee.data.length > 0) {
      console.log(8);
      let emp = selectedEmployee.data[0];
      console.log(9);
      let workspaces = await workspaceService.find({
        query: {
          facilityId: id,
          employeeId: emp._id
        }
      });
      console.log(10);
      emp.workSpaces = workspaces.data;
      console.log(11);
      if (emp.workSpaces.length > 0) {
        console.log(12);
        let len = emp.workSpaces.length - 1;
        console.log(13);
        for (let i = len; i >= 0; i--) {
          console.log(14);
          if (emp.workSpaces[i].locations.length > 0) {
            console.log(15);
            let len2 = emp.workSpaces[i].locations.length - 1;
            console.log(16);
            for (let j = len2; j >= 0; j--) {
              console.log(17);
              if (selectedfacility.minorLocations.length > 0) {
                console.log(18);
                let loc = selectedfacility.minorLocations.filter(x => x._id.toString() === emp.workSpaces[i].locations[j].minorLocationId.toString());
                console.log(19);
                emp.workSpaces[i].locations[j].name = loc[0].name;
                console.log(20);
              }
            }
          }
        }
        selectedEmployee.data[0] = emp;
        console.log(selectedEmployee.data[0].workSpaces[0]);
        return selectedEmployee;
      }
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
