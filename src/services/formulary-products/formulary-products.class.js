/* eslint-disable no-unused-vars */
const request = require('request-promise');
const jsend = require('jsend');
class Service {
  constructor(options) {
    this.options = options || {};
  }

  setup(app) {
    this.app = app;
  }

  async find(params) {
    let url = process.env.APMIS_FORMULARY + '/search-products?search=' + params.query.name;
    const options = {
      method: 'GET',
      uri: url
    };

    try {
      const product = await request(options);
      const parsed = JSON.parse(product);
      return jsend.success(parsed);
    } catch (e) {
      return jsend.success([]);
    }
  }

  async get(id, params) {
    let url = process.env.APMIS_FORMULARY + '/search-products/' + id;
    const options = {
      method: 'GET',
      uri: url
    };

    try {
      const product = await request(options);
      const parsed = JSON.parse(product);
      return jsend.success(parsed);
    } catch (e) {
      return jsend.success([]);
    }
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
