/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  find(params) {
    const request = require('request');
    return new Promise(function (resolve, reject) {
      let url = process.env.EMDEX_BASEURL + "/products/" + params.query.productId;
      let args = {
        headers: {
          "authorisation": process.env.EMDEX_AUTHORISATION_KEY
        }
      };
      request.get(url, args, (error, response, body) => {
        if (error) {}
        if (response && body) {
          resolve(response);
        }
      });
    });
  }

  get(id, params) {
    return Promise.resolve({
      id,
      text: `A new message with ID: ${id}!`
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
    return Promise.resolve({
      id
    });
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
