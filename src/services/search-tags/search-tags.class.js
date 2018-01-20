/* eslint-disable no-unused-vars */
const logger = require('winston');
class Service {
  constructor (options) {
    this.options = options || {};
  }

  find (params) {
    logger.info(params.search);
    const serviceTagService = this.app.service('service-tags');
    return new Promise(function (resolve, reject) {
      serviceTagService.find({
        query: {
          facilityId: params.facilityId,
          name: params.search
        }
      }).then(payload => {
        resolve(payload.data);
      }, error => {
        reject(error);
      });
    });
  }

  get (id, params) {
    return Promise.resolve({
      id, text: `A new message with ID: ${id}!`
    });
  }

  create (data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current)));
    }

    return Promise.resolve(data);
  }

  update (id, data, params) {
    return Promise.resolve(data);
  }

  patch (id, data, params) {
    return Promise.resolve(data);
  }

  remove (id, params) {
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
