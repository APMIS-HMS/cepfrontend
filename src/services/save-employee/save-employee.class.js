/* eslint-disable no-unused-vars */
const logger = require('winston');
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

  async create(data, params) {
    // const employeeService = this.app.service('employees');
    const userService = this.app.service('users');
    logger.info('wow');

    logger.info(1);
    let userList = await userService.find({
      query: {
        personId: data.personId
      }
    });
    logger.info(userList);
    if (userList.data.length > 0) {
      logger.info(3);
      let selectedUser = userList.data[0];
      if (selectedUser.facilitiesRole === undefined) {
        selectedUser.facilitiesRole = [];
        logger.info(4);
      }
      let facilityRole = {
        facilityId: data.facilityId,
      };
      let facilitiesRole = selectedUser.facilitiesRole;
      facilitiesRole.push(facilityRole);
      logger.info(5);
      logger.info(facilitiesRole);
      let patchedUser = await userService.patch(selectedUser._id, {
        facilitiesRole: facilitiesRole
      });
      logger.info(6);
      return patchedUser;
      // return await employeeService.create(data);
    } else {
      logger.info(2);
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
