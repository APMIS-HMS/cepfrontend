/* eslint-disable no-unused-vars */
const logger = require('winston');
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    const peopleService = this.app.service('people');
    if (params.query.isValidating === undefined || params.query.isValidating === false) {
      let returnData = await peopleService.find({
        query: {
          apmisId: params.query.apmisId,
          securityQuestion: params.query.securityQuestion,
          securityAnswer: params.query.securityAnswer
        }
      });
      if (returnData.data.length > 0) {
        return returnData.data[0]._id;
      } else {
        return undefined;
      }
    }else{
      let returnData = await peopleService.find({
        query: {
          firstName: params.query.firstName,
          lastName: params.query.lastName,
          motherMaidenName: params.query.motherMaidenName,
          primaryContactPhoneNo:params.query.primaryContactPhoneNo
        }
      });
      if (returnData.data.length > 0) {
        return jsend.success(true);
      } else {
        return jsend.fail(false);
      }  
    }


  }

  get(id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
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
